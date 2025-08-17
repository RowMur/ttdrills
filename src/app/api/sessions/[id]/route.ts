import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { UpdateSessionRequest } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Get session with session drills and drill details
    const { data: sessionData, error: sessionError } = await supabase
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
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (sessionError) {
      if (sessionError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching session:", sessionError);
      return NextResponse.json(
        { error: "Failed to fetch session" },
        { status: 500 }
      );
    }

    return NextResponse.json(sessionData);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body: UpdateSessionRequest = await request.json();
    const { name, notes, durationMinutes, date, sessionDrills } = body;

    // Check if session exists and belongs to user
    const { data: existingSession, error: checkError } = await supabase
      .from("sessions")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (checkError || !existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Update session
    const { error: updateError } = await supabase
      .from("sessions")
      .update({
        name,
        notes,
        duration_minutes: durationMinutes,
        date: date ? new Date(date).toISOString().split("T")[0] : undefined,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating session:", updateError);
      return NextResponse.json(
        { error: "Failed to update session" },
        { status: 500 }
      );
    }

    // If sessionDrills is provided, update them
    if (sessionDrills) {
      // Delete existing session drills
      await supabase.from("session_drills").delete().eq("session_id", id);

      // Insert new session drills
      if (sessionDrills.length > 0) {
        const sessionDrillsData = sessionDrills.map((sd) => ({
          session_id: id,
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
          console.error("Error updating session drills:", sessionDrillsError);
          return NextResponse.json(
            { error: "Failed to update session drills" },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Delete session (session_drills will be deleted automatically due to CASCADE)
    const { error: deleteError } = await supabase
      .from("sessions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting session:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
