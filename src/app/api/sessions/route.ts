import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { CreateSessionRequest, Session } from "@/types";

export async function POST(request: NextRequest) {
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

    // Parse the request body
    const body: CreateSessionRequest = await request.json();
    const { name, notes, durationMinutes, date, sessionDrills = [] } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Session name is required" },
        { status: 400 }
      );
    }

    // Validate that all drills have valid IDs (if any drills are provided)
    if (sessionDrills.length > 0) {
      const invalidDrills = sessionDrills.filter((sd) => !sd.drillId);
      if (invalidDrills.length > 0) {
        return NextResponse.json(
          { error: "All drills must have valid IDs" },
          { status: 400 }
        );
      }
    }

    // Start a transaction to create session and session drills
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
        name,
        notes,
        duration_minutes: durationMinutes,
        date: date || new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Error creating session:", sessionError);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    if (!sessionData?.id) {
      console.error("Session created but no ID returned:", sessionData);
      return NextResponse.json(
        { error: "Failed to create session - no ID returned" },
        { status: 500 }
      );
    }

    // Create session drills (only if drills are provided)
    if (sessionDrills.length > 0) {
      const sessionDrillsData = sessionDrills.map((sd) => ({
        session_id: sessionData.id,
        drill_id: sd.drillId,
        duration_minutes: sd.durationMinutes,
        notes: sd.notes,
        rating: sd.rating,
        repetitions: sd.repetitions || 1,
      }));

      const { error: sessionDrillsError } = await supabase
        .from("session_drills")
        .insert(sessionDrillsData);

      if (sessionDrillsError) {
        console.error("Error creating session drills:", sessionDrillsError);
        // Clean up the session if session drills creation fails
        await supabase.from("sessions").delete().eq("id", sessionData.id);
        return NextResponse.json(
          { error: "Failed to create session drills" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(sessionData, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const offset = (page - 1) * limit;

    // Build the query - first get sessions
    let query = supabase.from("sessions").select("*").eq("user_id", user.id);

    // Apply sorting with fallback to created_at for consistent ordering
    if (sortBy === "duration") {
      // For duration, we need to sort by duration_minutes
      query = query.order("duration_minutes", {
        ascending: sortOrder === "asc",
      });
    } else if (sortBy === "created_at") {
      // For created_at, no secondary sort needed
      query = query.order("created_at", { ascending: sortOrder === "asc" });
    } else {
      // For other fields, add created_at as secondary sort
      query = query.order(sortBy, { ascending: sortOrder === "asc" });
    }

    // Always add created_at as a secondary sort for consistent ordering (except when already sorting by created_at)
    if (sortBy !== "created_at") {
      query = query.order("created_at", { ascending: false });
    }

    // Apply pagination
    const { data: sessions, error: sessionsError } = await query.range(
      offset,
      offset + limit - 1
    );

    if (sessionsError) {
      console.error("Error fetching sessions:", sessionsError);
      return NextResponse.json(
        { error: "Failed to fetch sessions" },
        { status: 500 }
      );
    }

    // Get session drills for each session
    if (sessions && sessions.length > 0) {
      const sessionIds = sessions.map((s) => s.id);

      // First, let's just get the session drills without the drill data
      const { data: sessionDrills, error: sessionDrillsError } = await supabase
        .from("session_drills")
        .select("*")
        .in("session_id", sessionIds);

      if (sessionDrillsError) {
        console.error("Error fetching session drills:", sessionDrillsError);
      } else if (sessionDrills && sessionDrills.length > 0) {
        // Get drill IDs from session drills
        const drillIds = sessionDrills
          .map((sd) => sd.drill_id)
          .filter((id) => id) as string[];

        // Get drill data for these IDs
        const { data: drills, error: drillsError } = await supabase
          .from("drills")
          .select("id, name, slug, description, difficulty, categories")
          .in("id", drillIds);

        if (drillsError) {
          console.error("Error fetching drills:", drillsError);
        } else {
          // Create a map of ID to drill data
          const drillMap =
            drills?.reduce((acc, drill) => {
              acc[drill.id] = drill;
              return acc;
            }, {} as Record<string, (typeof drills)[0]>) || {};

          // Group session drills by session_id and add drill data
          const drillsBySession = sessionDrills.reduce((acc, sessionDrill) => {
            if (!acc[sessionDrill.session_id]) {
              acc[sessionDrill.session_id] = [];
            }
            // Add drill data to the session drill
            const drillData = drillMap[sessionDrill.drill_id];
            acc[sessionDrill.session_id].push({
              ...sessionDrill,
              drill: drillData,
            });
            return acc;
          }, {} as Record<string, ((typeof sessionDrills)[0] & { drill: (typeof drills)[0] })[]>);

          // Add sessionDrills to each session (camelCase for TypeScript)
          sessions.forEach((session) => {
            (
              session as Session & {
                sessionDrills: (typeof drillsBySession)[string];
              }
            ).sessionDrills = drillsBySession[session.id] || [];
          });
        }
      } else {
        // Add empty sessionDrills to each session (camelCase for TypeScript)
        sessions.forEach((session) => {
          (session as Session & { sessionDrills: [] }).sessionDrills = [];
        });
      }
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      console.error("Error counting sessions:", countError);
    }

    // Transform snake_case to camelCase for TypeScript
    const transformedSessions =
      sessions?.map((session) => ({
        id: session.id,
        userId: session.user_id,
        name: session.name,
        notes: session.notes,
        durationMinutes: session.duration_minutes,
        date: new Date(session.date),
        createdAt: new Date(session.created_at),
        updatedAt: new Date(session.updated_at),
        sessionDrills:
          (
            session as {
              sessionDrills?: Array<{
                id: string;
                session_id: string;
                drill_id: string;
                duration_minutes: number | null;
                notes: string | null;
                rating: number | null;
                repetitions: number | null;
                created_at: string;
                drill?: {
                  id: string;
                  name: string;
                  slug: string;
                  description: string;
                  difficulty: string;
                  categories: string[] | null;
                };
              }>;
            }
          ).sessionDrills?.map((sd) => ({
            id: sd.id,
            sessionId: sd.session_id,
            drillId: sd.drill_id,
            durationMinutes: sd.duration_minutes,
            notes: sd.notes,
            rating: sd.rating,
            repetitions: sd.repetitions,
            createdAt: new Date(sd.created_at),
            drill: sd.drill,
          })) || [],
      })) || [];

    return NextResponse.json({
      sessions: transformedSessions,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
