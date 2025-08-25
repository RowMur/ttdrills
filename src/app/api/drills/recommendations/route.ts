import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { generatePersonalizedRecommendations } from "@/lib/ai";

// Database types for the recommendations API
interface DatabaseSession {
  id: string;
  name: string;
  notes: string | null;
  date: string;
  is_competitive: boolean;
  is_draft: boolean;
  session_drills: DatabaseSessionDrill[];
}

interface DatabaseSessionDrill {
  drill_id: string;
  notes: string | null;
  rating: number | null;
  drill?: {
    id: string;
    name: string;
    difficulty: string;
    categories: string[] | null;
  }[];
}

interface DatabaseDrill {
  id: string;
  name: string;
  slug: string;
  description: string;
  difficulty: string;
  categories: string[] | null;
  objectives: string | null;
  tips: string | null;
}

export async function GET() {
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
        is_competitive,
        is_draft,
        session_drills (
          drill_id,
          notes,
          rating,
          drill:drills (
            id,
            name,
            difficulty,
            categories
          )
        )
      `
      )
      .eq("user_id", user.id)
      .eq("is_draft", false) // Exclude draft sessions from recommendations
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

    // Prepare user history for AI analysis
    const userHistory = (recentSessions as DatabaseSession[]).flatMap(
      (session) => {
        const sessionData = {
          sessionNotes: session.notes || "",
          sessionName: session.name,
          date: new Date(session.date || new Date()),
          isCompetitive: session.is_competitive || false,
          isDraft: session.is_draft || false,
        };

        // If session has drills, include them
        if (session.session_drills && session.session_drills.length > 0) {
          return session.session_drills.map((sd) => ({
            ...sessionData,
            drillName: sd.drill?.[0]?.name || "Unknown Drill",
            rating: sd.rating || undefined,
            hasDrills: true,
          }));
        } else {
          // For sessions without drills (practice matches, general training)
          return [
            {
              ...sessionData,
              drillName: session.is_competitive
                ? "Competitive Match"
                : "Practice Session",
              rating: undefined,
              hasDrills: false,
            },
          ];
        }
      }
    );

    // Generate AI-powered recommendations
    const aiRecommendations = await generatePersonalizedRecommendations(
      userHistory,
      (allDrills as DatabaseDrill[]).map((drill) => ({
        id: drill.id,
        name: drill.name,
        description: drill.description,
        difficulty: drill.difficulty,
        categories: drill.categories || [],
      }))
    );

    // Combine AI recommendations with available drill data
    const recommendations = aiRecommendations
      .map((aiRec) => {
        // First try exact ID match
        let drill = (allDrills as DatabaseDrill[]).find(
          (d) => d.id === aiRec.drillId
        );

        // If no exact match, try to find by name (fallback for AI mistakes)
        if (!drill && aiRec.drillId) {
          drill = (allDrills as DatabaseDrill[]).find(
            (d) => d.name.toLowerCase() === aiRec.drillId.toLowerCase()
          );
        }

        if (!drill) {
          console.warn(
            `AI recommended drill with invalid ID/name: "${aiRec.drillId}"`
          );
          return null;
        }

        return {
          ...drill,
          score:
            aiRec.priority === "high"
              ? 10
              : aiRec.priority === "medium"
              ? 7
              : 4,
          reason: aiRec.reason,
          aiInsights: {
            priority: aiRec.priority,
            expectedOutcome: aiRec.expectedOutcome,
            personalization: aiRec.personalization,
          },
        };
      })
      .filter(Boolean)
      .slice(0, 6);

    return NextResponse.json({
      recommendations,
      analysis: {
        sessionCount: recentSessions?.length || 0,
        timeRange: "30 days",
        aiPowered: true,
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
