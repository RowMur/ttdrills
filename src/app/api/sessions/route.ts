import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { CreateSessionRequest } from "@/types";

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
    const { name, notes, durationMinutes, date, sessionDrills } = body;

    // Validate required fields
    if (!name || !sessionDrills || sessionDrills.length === 0) {
      return NextResponse.json(
        { error: "Session name and at least one drill are required" },
        { status: 400 }
      );
    }

    // Validate that all drills have valid IDs
    const invalidDrills = sessionDrills.filter((sd) => !sd.drillId);
    if (invalidDrills.length > 0) {
      return NextResponse.json(
        { error: "All drills must have valid IDs" },
        { status: 400 }
      );
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

    console.log("Created session with ID:", sessionData.id);

    // Create session drills
    const sessionDrillsData = sessionDrills.map((sd) => ({
      session_id: sessionData.id,
      drill_id: sd.drillId,
      duration_minutes: sd.durationMinutes,
      notes: sd.notes,
      rating: sd.rating,
      repetitions: sd.repetitions || 1,
    }));

    console.log("Session drills data:", sessionDrillsData);

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
    const offset = (page - 1) * limit;

    // Get sessions with session drills and drill details
    const { data: sessions, error: sessionsError } = await supabase
      .from("sessions")
      .select(
        `
        *,
        session_drills (
          *,
          drill:drills (
            id,
            name,
            slug,
            description,
            difficulty,
            categories
          )
        )
      `
      )
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (sessionsError) {
      console.error("Error fetching sessions:", sessionsError);
      return NextResponse.json(
        { error: "Failed to fetch sessions" },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      console.error("Error counting sessions:", countError);
    }

    return NextResponse.json({
      sessions,
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
