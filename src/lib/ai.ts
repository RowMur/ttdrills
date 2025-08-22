import OpenAI from "openai";

// Initialize OpenRouter client (compatible with OpenAI SDK)
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
    "X-Title": "Table Tennis Drills App",
  },
});

// Simple in-memory cache (for production, consider Redis or similar)
const cache = new Map<
  string,
  { data: unknown; timestamp: number; ttl: number }
>();

// Cache configuration
const CACHE_TTL = {
  SESSION_ANALYSIS: 24 * 60 * 60 * 1000, // 24 hours
  RECOMMENDATIONS: 6 * 60 * 60 * 1000, // 6 hours
  EXPLANATIONS: 12 * 60 * 60 * 1000, // 12 hours
};

// Utility function to clean AI response content
function cleanAIResponse(content: string): string {
  return content
    .replace(/```json\s*/g, "")
    .replace(/```\s*$/g, "")
    .trim();
}

// Cache utility functions
function getCacheKey(prefix: string, data: string): string {
  return `${prefix}:${Buffer.from(data).toString("base64").slice(0, 32)}`;
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

function setCache<T>(key: string, data: T, ttl: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });

  // Clean up old entries (keep cache size manageable)
  if (cache.size > 1000) {
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    entries.slice(0, 100).forEach(([key]) => cache.delete(key));
    console.log(
      `AI Cache: Cleaned up 100 old entries. Current size: ${cache.size}`
    );
  }

  console.log(`AI Cache: Stored entry. Current size: ${cache.size}`);
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
  const cached = getFromCache<SessionAnalysis>(cacheKey);
  if (cached) {
    console.log("Cache hit: session analysis");
    return cached;
  }

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

    const analysis = JSON.parse(
      cleanAIResponse(response.choices[0].message.content || "{}")
    );

    // Cache the result
    setCache(cacheKey, analysis, CACHE_TTL.SESSION_ANALYSIS);

    return analysis as SessionAnalysis;
  } catch (error) {
    console.error("Error analyzing session notes:", error);
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
}

export async function generatePersonalizedRecommendations(
  userHistory: Array<{
    sessionNotes: string;
    sessionName: string;
    drillName: string;
    rating?: number;
    date: Date;
    hasDrills: boolean;
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
  const cached = getFromCache<AIRecommendation[]>(cacheKey);
  if (cached) {
    console.log("Cache hit: recommendations");
    return cached;
  }

  try {
    // Analyze recent sessions
    const recentSessions = userHistory.slice(-5); // Last 5 sessions
    const sessionAnalyses = await Promise.all(
      recentSessions.map((session) => analyzeSessionNotes(session.sessionNotes))
    );
    // Debug logging (remove in production)
    console.log(sessionAnalyses);

    // Create a summary of user's recent activity
    const drillSessions = recentSessions.filter((s) => s.hasDrills);
    const practiceSessions = recentSessions.filter((s) => !s.hasDrills);

    const userSummary = {
      recentDrills: drillSessions.map((s) => s.drillName),
      practiceSessions: practiceSessions.map((s) => s.sessionName),
      averageRating:
        drillSessions
          .filter((s) => s.rating)
          .reduce((sum, s) => sum + (s.rating || 0), 0) /
          drillSessions.filter((s) => s.rating).length || 0,
      commonSkills: sessionAnalyses.flatMap((a) => a.skills),
      challenges: sessionAnalyses.flatMap((a) => a.challenges),
      improvements: sessionAnalyses.flatMap((a) => a.improvements),
      weaknesses: sessionAnalyses.flatMap((a) => a.weaknesses),
      practiceSessionCount: practiceSessions.length,
      drillSessionCount: drillSessions.length,
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
- Drill sessions: ${userSummary.drillSessionCount}, Practice sessions: ${
            userSummary.practiceSessionCount
          }
- Average rating: ${userSummary.averageRating.toFixed(1)}/5
- Skills practiced: ${[...new Set(userSummary.commonSkills)].join(", ")}
- Challenges: ${[...new Set(userSummary.challenges)].join(", ")}
- Improvements: ${[...new Set(userSummary.improvements)].join(", ")}
- Weaknesses: ${[...new Set(userSummary.weaknesses)].join(", ")}

Consider the user's practice session notes when recommending drills. If they mention specific weaknesses or areas for improvement in practice matches, recommend drills that target those areas. Prioritize drills that address their identified weaknesses.

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
        },
        {
          role: "user",
          content:
            "Generate personalized drill recommendations for this player.",
        },
      ],
      temperature: 0.7,
    });

    const recommendations = JSON.parse(
      cleanAIResponse(response.choices[0].message.content || "[]")
    );

    // Cache the result
    setCache(cacheKey, recommendations, CACHE_TTL.RECOMMENDATIONS);

    return recommendations as AIRecommendation[];
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    return [];
  }
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
  const cached = getFromCache<string>(cacheKey);
  if (cached) {
    console.log("Cache hit: explanation");
    return cached;
  }

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

    // Cache the result
    setCache(cacheKey, explanation, CACHE_TTL.EXPLANATIONS);

    return explanation;
  } catch (error) {
    console.error("Error generating explanation:", error);
    return "This drill is recommended based on your training history.";
  }
}

// Cache management functions
export function clearCache(): void {
  cache.clear();
}

export function getCacheStats(): {
  size: number;
  entries: Array<{ key: string; age: number }>;
} {
  const now = Date.now();
  const entries = Array.from(cache.entries()).map(([key, value]) => ({
    key,
    age: now - value.timestamp,
  }));

  return {
    size: cache.size,
    entries: entries.sort((a, b) => b.age - a.age).slice(0, 10), // Top 10 oldest entries
  };
}
