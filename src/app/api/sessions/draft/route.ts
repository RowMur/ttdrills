import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { UpdateDraftSessionRequest } from "@/types";

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

    // Get user's draft session
    const { data: draftSession, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_draft", true)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching draft session:", error);
      return NextResponse.json(
        { error: "Failed to fetch draft session" },
        { status: 500 }
      );
    }

    if (!draftSession) {
      return NextResponse.json({ draftSession: null });
    }

    // Transform to camelCase
    const transformedSession = {
      id: draftSession.id,
      userId: draftSession.user_id,
      name: draftSession.name,
      notes: draftSession.notes,
      durationMinutes: draftSession.duration_minutes,
      date: new Date(draftSession.date),
      isCompetitive: draftSession.is_competitive || false,
      isDraft: draftSession.is_draft || false,
      createdAt: new Date(draftSession.created_at),
      updatedAt: new Date(draftSession.updated_at),
    };

    return NextResponse.json({ draftSession: transformedSession });
  } catch (error) {
    console.error("Error fetching draft session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    const body: UpdateDraftSessionRequest = await request.json();
    const { notes, durationMinutes } = body;

    // Get user's draft session
    const { data: draftSession, error: fetchError } = await supabase
      .from("sessions")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_draft", true)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching draft session:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch draft session" },
        { status: 500 }
      );
    }

    if (!draftSession) {
      return NextResponse.json(
        { error: "No draft session found" },
        { status: 404 }
      );
    }

    // Update the draft session
    const { data: updatedSession, error: updateError } = await supabase
      .from("sessions")
      .update({
        notes,
        duration_minutes: durationMinutes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", draftSession.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating draft session:", updateError);
      return NextResponse.json(
        { error: "Failed to update draft session" },
        { status: 500 }
      );
    }

    // Transform to camelCase
    const transformedSession = {
      id: updatedSession.id,
      userId: updatedSession.user_id,
      name: updatedSession.name,
      notes: updatedSession.notes,
      durationMinutes: updatedSession.duration_minutes,
      date: new Date(updatedSession.date),
      isCompetitive: updatedSession.is_competitive || false,
      isDraft: updatedSession.is_draft || false,
      createdAt: new Date(updatedSession.created_at),
      updatedAt: new Date(updatedSession.updated_at),
    };

    return NextResponse.json({ draftSession: transformedSession });
  } catch (error) {
    console.error("Error updating draft session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
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

    // Delete user's draft session
    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("user_id", user.id)
      .eq("is_draft", true);

    if (error) {
      console.error("Error deleting draft session:", error);
      return NextResponse.json(
        { error: "Failed to delete draft session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting draft session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const body: UpdateDraftSessionRequest = await request.json();
    const { notes, durationMinutes } = body;

    // Get user's draft session
    const { data: draftSession, error: fetchError } = await supabase
      .from("sessions")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_draft", true)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching draft session:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch draft session" },
        { status: 500 }
      );
    }

    if (!draftSession) {
      return NextResponse.json(
        { error: "No draft session found" },
        { status: 404 }
      );
    }

    // Complete the draft session (set is_draft to false and update fields)
    const { data: completedSession, error: updateError } = await supabase
      .from("sessions")
      .update({
        is_draft: false,
        notes,
        duration_minutes: durationMinutes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", draftSession.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error completing draft session:", updateError);
      return NextResponse.json(
        { error: "Failed to complete draft session" },
        { status: 500 }
      );
    }

    // Transform to camelCase
    const transformedSession = {
      id: completedSession.id,
      userId: completedSession.user_id,
      name: completedSession.name,
      notes: completedSession.notes,
      durationMinutes: completedSession.duration_minutes,
      date: new Date(completedSession.date),
      isCompetitive: completedSession.is_competitive || false,
      isDraft: completedSession.is_draft || false,
      createdAt: new Date(completedSession.created_at),
      updatedAt: new Date(completedSession.updated_at),
    };

    return NextResponse.json({ session: transformedSession });
  } catch (error) {
    console.error("Error completing draft session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
