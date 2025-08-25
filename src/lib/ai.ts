import OpenAI from "openai";
import { unstable_cache } from "next/cache";
import { trackAICacheHit, trackAICacheMiss, trackAIError } from "./analytics";

// Initialize OpenRouter client (compatible with OpenAI SDK)
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
    "X-Title": "Table Tennis Drills App",
  },
});

// Cache configuration using Next.js unstable_cache
const CACHE_CONFIG = {
  SESSION_ANALYSIS: { revalidate: 86400 }, // 24 hours
  RECOMMENDATIONS: { revalidate: 21600 }, // 6 hours
  EXPLANATIONS: { revalidate: 43200 }, // 12 hours
};

// Utility function to clean AI response content
function cleanAIResponse(content: string): string {
  return content
    .replace(/```json\s*/g, "")
    .replace(/```\s*$/g, "")
    .trim();
}

// Cache key generator
function getCacheKey(prefix: string, data: string): string {
  return `${prefix}:${Buffer.from(data)
    .toString("base64")
    .slice(0, 32)}${Math.random().toString()}`;
}

// Helpers to robustly parse AI JSON output
function normalizeSmartQuotes(input: string): string {
  return input.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
}

function extractJsonArray(text: string): string | null {
  const first = text.indexOf("[");
  const last = text.lastIndexOf("]");
  if (first !== -1 && last !== -1 && last > first) {
    return text.slice(first, last + 1);
  }
  return null;
}

function parseAiJsonArray(content: string): unknown[] {
  const cleaned = cleanAIResponse(normalizeSmartQuotes(content));
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object") {
      const obj = parsed as Record<string, unknown>;
      const arr = obj["recommendations"];
      if (Array.isArray(arr)) return arr as unknown[];
    }
  } catch {
    // fall through
  }
  const arraySlice = extractJsonArray(cleaned);
  if (arraySlice) {
    const candidate = arraySlice.replace(/,\s*([}\]])/g, "$1");
    const parsed = JSON.parse(candidate);
    if (Array.isArray(parsed)) return parsed;
  }
  throw new Error("invalid_json_array");
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export interface SessionAnalysis {
  skills: string[];
  mood: string;
  energyLevel: "low" | "medium" | "high";
  focusAreas: string[];
  challenges: string[];
  improvements: string[];
  weaknesses: string[];
}

export interface AIRecommendation {
  drillId: string;
  reason: string;
  priority: "high" | "medium" | "low";
  expectedOutcome: string;
  personalization: string;
}

export async function analyzeSessionNotes(
  notes: string
): Promise<SessionAnalysis> {
  if (!notes.trim()) {
    return {
      skills: [],
      mood: "neutral",
      energyLevel: "medium",
      focusAreas: [],
      challenges: [],
      improvements: [],
      weaknesses: [],
    };
  }

  // Check cache first
  const cacheKey = getCacheKey("session_analysis", notes);
  const cached = unstable_cache(
    async () => {
      console.log("Cache miss: session analysis");
      trackAICacheMiss("session_analysis");
      try {
        const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
        const response = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content: `You are a table tennis coach analyzing a player's session notes. Extract key insights about:
- Skills practiced or mentioned
- Player's mood and energy level
- Areas they focused on
- Challenges they faced
- Improvements they noticed
- Specific weaknesses or areas needing work (especially from practice matches)

IMPORTANT: Return ONLY a JSON object with these fields. Do NOT use markdown formatting or code blocks. Just return the raw JSON:

{
  "skills": ["array of skills mentioned"],
  "mood": "positive/negative/neutral",
  "energyLevel": "low/medium/high", 
  "focusAreas": ["areas they focused on"],
  "challenges": ["challenges they faced"],
  "improvements": ["improvements they noticed"],
  "weaknesses": ["specific weaknesses or areas needing work"]
}`,
            },
            {
              role: "user",
              content: `Analyze this session note: "${notes}"`,
            },
          ],
          temperature: 0.3,
        });

        const clean = cleanAIResponse(
          response.choices[0].message.content || "{}"
        );
        // console.log("clean", clean);
        const analysis = JSON.parse(clean);
        return analysis;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        console.error("AI session analysis step failed:", message);
        trackAIError("session_analysis", message);
        throw new Error(`session_analysis_failed: ${message}`);
      }
    },
    [cacheKey],
    CACHE_CONFIG.SESSION_ANALYSIS
  );

  const result = await cached();
  console.log("Cache hit: session analysis");
  trackAICacheHit("session_analysis");
  return result;
}

export async function generatePersonalizedRecommendations(
  userHistory: Array<{
    sessionNotes: string;
    sessionName: string;
    drillName: string;
    rating?: number;
    date: Date;
    hasDrills: boolean;
    isCompetitive: boolean;
    isDraft: boolean;
  }>,
  availableDrills: Array<{
    id: string;
    name: string;
    description: string;
    difficulty: string;
    categories: string[];
  }>
): Promise<AIRecommendation[]> {
  if (!userHistory.length) {
    return [];
  }

  // Create cache key based on user history and available drills
  const historyHash = JSON.stringify({
    history: userHistory.map((h) => ({
      notes: h.sessionNotes,
      drill: h.drillName,
      rating: h.rating,
      date: h.date.toISOString().split("T")[0], // Date only
    })),
    drills: availableDrills.map((d) => d.id).sort(),
  });

  const cacheKey = getCacheKey("recommendations", historyHash);
  const cached = unstable_cache(
    async () => {
      console.log("Cache miss: recommendations");
      trackAICacheMiss("recommendations");
      try {
        // Analyze recent sessions
        const recentSessions = userHistory.slice(-5); // Last 5 sessions
        const sessionAnalysesResults = await Promise.allSettled(
          recentSessions.map((session) =>
            analyzeSessionNotes(session.sessionNotes)
          )
        );
        const sessionAnalyses = sessionAnalysesResults.flatMap((res, idx) => {
          if (res.status === "fulfilled") {
            return [res.value];
          }
          const message =
            res.reason instanceof Error
              ? res.reason.message
              : String(res.reason ?? "Unknown error");
          console.error(
            "Session analysis item failed (recent session %d): %s",
            idx,
            message
          );
          trackAIError("session_analysis_item", message);
          return [] as never[];
        });
        if (!sessionAnalyses.length) {
          throw new Error("session_analysis_all_failed");
        }

        // Create a summary of user's recent activity
        const drillSessions = recentSessions.filter((s) => s.hasDrills);
        const practiceSessions = recentSessions.filter(
          (s) => !s.hasDrills && !s.isCompetitive && !s.isDraft
        );
        const competitiveSessions = recentSessions.filter(
          (s) => s.isCompetitive && !s.isDraft
        );

        // Analyze competitive sessions separately to identify high-priority weaknesses
        const competitiveAnalysesResults = await Promise.allSettled(
          competitiveSessions.map((session) =>
            analyzeSessionNotes(session.sessionNotes)
          )
        );
        const competitiveSessionAnalyses = competitiveAnalysesResults.flatMap(
          (res, idx) => {
            if (res.status === "fulfilled") {
              return [res.value];
            }
            const message =
              res.reason instanceof Error
                ? res.reason.message
                : String(res.reason ?? "Unknown error");
            console.error(
              "Session analysis item failed (competitive session %d): %s",
              idx,
              message
            );
            trackAIError("competitive_session_analysis_item", message);
            return [] as never[];
          }
        );

        const userSummary = {
          recentDrills: drillSessions.map((s) => s.drillName),
          practiceSessions: practiceSessions.map((s) => s.sessionName),
          competitiveSessions: competitiveSessions.map((s) => s.sessionName),
          averageRating:
            drillSessions
              .filter((s) => s.rating)
              .reduce((sum, s) => sum + (s.rating || 0), 0) /
              drillSessions.filter((s) => s.rating).length || 0,
          commonSkills: sessionAnalyses.flatMap((a) => a.skills),
          challenges: sessionAnalyses.flatMap((a) => a.challenges),
          improvements: sessionAnalyses.flatMap((a) => a.improvements),
          weaknesses: sessionAnalyses.flatMap((a) => a.weaknesses),
          // High-priority weaknesses from competitive sessions
          competitiveWeaknesses: competitiveSessionAnalyses.flatMap(
            (a) => a.weaknesses
          ),
          practiceSessionCount: practiceSessions.length,
          drillSessionCount: drillSessions.length,
          competitiveSessionCount: competitiveSessions.length,
        };

        const response = await openai.chat.completions.create({
          model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a table tennis coach creating personalized drill recommendations. 

User Summary:
- Recent drills: ${userSummary.recentDrills.join(", ")}
- Practice sessions: ${userSummary.practiceSessions.join(", ")}
- Competitive sessions: ${userSummary.competitiveSessions.join(", ")}
- Drill sessions: ${userSummary.drillSessionCount}, Practice sessions: ${
                userSummary.practiceSessionCount
              }, Competitive sessions: ${userSummary.competitiveSessionCount}
- Average rating: ${userSummary.averageRating.toFixed(1)}/5
- Skills practiced: ${[...new Set(userSummary.commonSkills)].join(", ")}
- Challenges: ${[...new Set(userSummary.challenges)].join(", ")}
- Improvements: ${[...new Set(userSummary.improvements)].join(", ")}
- Weaknesses: ${[...new Set(userSummary.weaknesses)].join(", ")}
- COMPETITIVE WEAKNESSES (HIGH PRIORITY): ${[
                ...new Set(userSummary.competitiveWeaknesses),
              ].join(", ")}

CRITICAL: Pay special attention to weaknesses identified in competitive sessions (competitive matches and tournaments). These weaknesses should be given HIGHEST PRIORITY when recommending drills, as they represent real competitive pressure situations where the player struggled.

Consider the user's practice session notes when recommending drills. If they mention specific weaknesses or areas for improvement in practice matches, recommend drills that target those areas. Prioritize drills that address their identified weaknesses, with competitive session weaknesses getting the highest priority.

Available Drills:
${availableDrills
  .map(
    (d) =>
      `- ID: "${d.id}" | Name: "${d.name}" | Difficulty: ${d.difficulty} | Description: ${d.description}`
  )
  .join("\n")}

For each recommended drill, provide:
- drillId: the EXACT drill ID from the list above (e.g., "drill-123")
- reason: why this drill is recommended (personalized to the user)
- priority: high/medium/low based on user's needs
- expectedOutcome: what the user should achieve
- personalization: specific advice for this user

CRITICAL: You MUST use the exact drill ID from the list above. Do NOT use drill names or create new IDs. Only use the IDs provided in the "Available Drills" list.

Example correct response:
[
  {
    "drillId": "drill-123",
    "priority": "high",
    "reason": "Targets your weak backhand mentioned in recent practice",
    "expectedOutcome": "Improved backhand consistency and power",
    "personalization": "Based on your practice match notes about backhand struggles"
  }
]

IMPORTANT: Return ONLY a JSON array of 3-6 recommendations. Do NOT use markdown formatting, code blocks, or any other formatting. Just return the raw JSON array.`,
              // Reinforce field requirements to reduce malformed output
            },
            {
              role: "system",
              content:
                'All fields are REQUIRED for each recommendation. If unsure about priority, set "priority" to "medium".',
            },
            {
              role: "user",
              content:
                "Generate personalized drill recommendations for this player.",
            },
          ],
          temperature: 0.7,
        });

        const rawContent = response.choices[0].message.content || "[]";
        const parsed = parseAiJsonArray(rawContent);
        const recommendations = parsed
          .filter((item) => isObjectRecord(item))
          .map((item) => {
            const priority =
              item["priority"] === "high" ||
              item["priority"] === "medium" ||
              item["priority"] === "low"
                ? (item["priority"] as "high" | "medium" | "low")
                : "medium";
            return {
              drillId: String((item["drillId"] ?? item["id"] ?? "") as string),
              reason: String((item["reason"] ?? "") as string),
              priority,
              expectedOutcome: String(
                (item["expectedOutcome"] ?? item["outcome"] ?? "") as string
              ),
              personalization: String(
                (item["personalization"] ?? item["tips"] ?? "") as string
              ),
            } as AIRecommendation;
          })
          .filter((r: AIRecommendation) => r.drillId && r.reason);
        if (!recommendations.length) {
          throw new Error("empty_recommendations_after_parse");
        }
        return recommendations;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        console.error("AI recommendations generation step failed:", message);
        trackAIError("recommendations_generation", message);
        throw new Error(`recommendations_generation_failed: ${message}`);
      }
    },
    [cacheKey],
    CACHE_CONFIG.RECOMMENDATIONS
  );

  const result = await cached();
  console.log("Cache hit: recommendations");
  trackAICacheHit("recommendations");
  return result;
}

export async function generateRecommendationExplanation(
  drillName: string,
  drillDescription: string,
  userContext: {
    recentSessions: string[];
    averageRating: number;
    commonChallenges: string[];
  }
): Promise<string> {
  // Create cache key based on drill and user context
  const contextHash = JSON.stringify({
    drill: drillName,
    description: drillDescription,
    context: userContext,
  });

  const cacheKey = getCacheKey("explanation", contextHash);
  const cached = unstable_cache(
    async () => {
      console.log("Cache miss: explanation");
      trackAICacheMiss("explanation");
      try {
        const response = await openai.chat.completions.create({
          model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a table tennis coach explaining why a specific drill is recommended to a player. Be encouraging, specific, and personal. Keep explanations under 100 words.`,
            },
            {
              role: "user",
              content: `Explain why "${drillName}" (${drillDescription}) is recommended for a player who:
- Recently practiced: ${userContext.recentSessions.join(", ")}
- Average rating: ${userContext.averageRating.toFixed(1)}/5
- Common challenges: ${userContext.commonChallenges.join(", ")}

Make it personal and motivating.`,
            },
          ],
          temperature: 0.8,
        });

        const explanation =
          response.choices[0].message.content ||
          "This drill will help improve your game!";
        return explanation;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        console.error("AI explanation generation step failed:", message);
        trackAIError("explanation_generation", message);
        throw new Error(`explanation_generation_failed: ${message}`);
      }
    },
    [cacheKey],
    CACHE_CONFIG.EXPLANATIONS
  );

  const result = await cached();
  console.log("Cache hit: explanation");
  trackAICacheHit("explanation");
  return result;
}
