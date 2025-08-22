import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/lib/database";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's recent sessions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentSessions, error: sessionsError } = await supabase
      .from("sessions")
      .select(
        `
        id,
        name,
        notes,
        session_drills (
          drill_id,
          notes,
          rating
        )
      `
      )
      .eq("user_id", user.id)
      .gte("date", thirtyDaysAgo.toISOString().split("T")[0])
      .order("date", { ascending: false })
      .limit(20);

    if (sessionsError) {
      console.error("Error fetching recent sessions:", sessionsError);
      return NextResponse.json(
        { error: "Failed to fetch session history" },
        { status: 500 }
      );
    }

    // Extract keywords from session names and notes
    const keywords = extractKeywords(recentSessions || []);

    // Get all available drills
    const { data: allDrills, error: drillsError } = await supabase
      .from("drills")
      .select(
        "id, name, slug, description, difficulty, categories, objectives, tips"
      )
      .order("name");

    if (drillsError) {
      console.error("Error fetching drills:", drillsError);
      return NextResponse.json(
        { error: "Failed to fetch drills" },
        { status: 500 }
      );
    }

    // Score and rank drills based on user history
    const scoredDrills = scoreDrills(
      allDrills || [],
      keywords,
      recentSessions || []
    );

    // Return top 6 recommendations
    const recommendations = scoredDrills.slice(0, 6);

    return NextResponse.json({
      recommendations,
      analysis: {
        keywords,
        sessionCount: recentSessions?.length || 0,
        timeRange: "30 days",
      },
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function extractKeywords(sessions: any[]): string[] {
  const keywords = new Set<string>();

  sessions.forEach((session) => {
    // Extract from session name
    if (session.name) {
      const nameWords = session.name
        .toLowerCase()
        .split(/\s+/)
        .filter((word: string) => word.length > 2)
        .filter(
          (word: string) =>
            ![
              "the",
              "and",
              "for",
              "with",
              "vs",
              "match",
              "session",
              "practice",
            ].includes(word)
        );
      nameWords.forEach((word: string) => keywords.add(word));
    }

    // Extract from session notes
    if (session.notes) {
      const noteWords = session.notes
        .toLowerCase()
        .split(/\s+/)
        .filter((word: string) => word.length > 3)
        .filter(
          (word: string) =>
            ![
              "the",
              "and",
              "for",
              "with",
              "that",
              "this",
              "have",
              "been",
              "will",
              "need",
              "want",
              "good",
              "bad",
              "well",
              "poor",
            ].includes(word)
        );
      noteWords.forEach((word: string) => keywords.add(word));
    }

    // Extract from session drill notes
    if (session.session_drills) {
      session.session_drills.forEach((drill: any) => {
        if (drill.notes) {
          const drillNoteWords = drill.notes
            .toLowerCase()
            .split(/\s+/)
            .filter((word: string) => word.length > 3)
            .filter(
              (word: string) =>
                ![
                  "the",
                  "and",
                  "for",
                  "with",
                  "that",
                  "this",
                  "have",
                  "been",
                  "will",
                  "need",
                  "want",
                  "good",
                  "bad",
                  "well",
                  "poor",
                ].includes(word)
            );
          drillNoteWords.forEach((word: string) => keywords.add(word));
        }
      });
    }
  });

  return Array.from(keywords);
}

function scoreDrills(
  drills: any[],
  keywords: string[],
  sessions: any[]
): any[] {
  return drills
    .map((drill) => {
      let score = 0;
      const drillText = `${drill.name} ${
        drill.description
      } ${drill.objectives?.join(" ")} ${drill.tips?.join(
        " "
      )} ${drill.categories?.join(" ")}`.toLowerCase();

      // Score based on keyword matches
      keywords.forEach((keyword) => {
        if (drillText.includes(keyword)) {
          score += 2;
        }
      });

      // Score based on difficulty progression
      const userDifficulty = analyzeUserDifficulty(sessions);
      if (userDifficulty === drill.difficulty) {
        score += 3;
      } else if (shouldProgressDifficulty(userDifficulty, drill.difficulty)) {
        score += 2;
      }

      // Score based on category variety
      const userCategories = analyzeUserCategories(sessions);
      if (!userCategories.includes(drill.categories?.[0])) {
        score += 1; // Encourage trying new categories
      }

      // Score based on recent performance
      const recentPerformance = analyzeRecentPerformance(sessions, drill.id);
      if (recentPerformance === "needs_work") {
        score += 4; // Prioritize drills that need work
      } else if (recentPerformance === "excellent") {
        score += 1; // Slightly boost drills user excels at
      }

      // Bonus for beginner-friendly drills if user is new
      if (sessions.length < 5 && drill.difficulty === "beginner") {
        score += 2;
      }

      return {
        ...drill,
        score,
        reason: generateRecommendationReason(
          drill,
          keywords,
          userDifficulty,
          recentPerformance
        ),
      };
    })
    .sort((a, b) => b.score - a.score);
}

function analyzeUserDifficulty(sessions: any[]): string {
  if (sessions.length === 0) return "beginner";

  const difficulties = sessions.flatMap(
    (session) =>
      session.session_drills?.map((drill: any) => drill.difficulty) || []
  );

  if (difficulties.length === 0) return "beginner";

  const difficultyCounts = difficulties.reduce((acc: any, diff) => {
    acc[diff] = (acc[diff] || 0) + 1;
    return acc;
  }, {});

  if (
    difficultyCounts.advanced > difficultyCounts.intermediate &&
    difficultyCounts.advanced > difficultyCounts.beginner
  ) {
    return "advanced";
  } else if (difficultyCounts.intermediate > difficultyCounts.beginner) {
    return "intermediate";
  }

  return "beginner";
}

function shouldProgressDifficulty(
  userDifficulty: string,
  drillDifficulty: string
): boolean {
  const progression = { beginner: 1, intermediate: 2, advanced: 3 };
  return (
    progression[drillDifficulty as keyof typeof progression] ===
    progression[userDifficulty as keyof typeof progression] + 1
  );
}

function analyzeUserCategories(sessions: any[]): string[] {
  const categories = sessions
    .flatMap(
      (session) =>
        session.session_drills?.map((drill: any) => drill.categories) || []
    )
    .flat();

  return [...new Set(categories)];
}

function analyzeRecentPerformance(sessions: any[], drillId: string): string {
  const recentDrills = sessions.flatMap(
    (session) =>
      session.session_drills?.filter(
        (drill: any) => drill.drill_id === drillId
      ) || []
  );

  if (recentDrills.length === 0) return "new";

  const recentRatings = recentDrills
    .map((drill: any) => drill.rating)
    .filter((r) => r);

  if (recentRatings.length === 0) return "new";

  const avgRating =
    recentRatings.reduce((sum, rating) => sum + rating, 0) /
    recentRatings.length;

  if (avgRating <= 2) return "needs_work";
  if (avgRating >= 4) return "excellent";
  return "good";
}

function generateRecommendationReason(
  drill: any,
  keywords: string[],
  userDifficulty: string,
  recentPerformance: string
): string {
  const reasons = [];

  if (
    keywords.some(
      (keyword) =>
        drill.name.toLowerCase().includes(keyword) ||
        drill.description.toLowerCase().includes(keyword)
    )
  ) {
    reasons.push("Matches your recent training focus");
  }

  if (recentPerformance === "needs_work") {
    reasons.push("Based on areas you're working on");
  } else if (recentPerformance === "excellent") {
    reasons.push("Builds on your strengths");
  }

  if (drill.difficulty === userDifficulty) {
    reasons.push("Matches your current skill level");
  } else if (shouldProgressDifficulty(userDifficulty, drill.difficulty)) {
    reasons.push("Helps you progress to the next level");
  }

  if (reasons.length === 0) {
    reasons.push("Great for skill development");
  }

  return reasons.join(" • ");
}
