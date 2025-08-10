import { NextRequest, NextResponse } from "next/server";
import { getDrillBySlug, deleteDrill, updateDrill } from "@/lib/database";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/lib/database";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const drill = await getDrillBySlug(slug);

    if (!drill) {
      return NextResponse.json({ error: "Drill not found" }, { status: 404 });
    }

    return NextResponse.json(drill);
  } catch (error) {
    console.error("Error fetching drill:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

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

    // Get the drill to check ownership
    const drill = await getDrillBySlug(slug);

    if (!drill) {
      return NextResponse.json({ error: "Drill not found" }, { status: 404 });
    }

    // Check if user owns the drill
    if (drill.creator_id !== user.id) {
      return NextResponse.json(
        { error: "You can only delete your own drills" },
        { status: 403 }
      );
    }

    // Delete the drill
    const success = await deleteDrill(slug);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete drill" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Drill deleted successfully" });
  } catch (error) {
    console.error("Error deleting drill:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

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

    // Get the drill to check ownership
    const existingDrill = await getDrillBySlug(slug);

    if (!existingDrill) {
      return NextResponse.json({ error: "Drill not found" }, { status: 404 });
    }

    // Check if user owns the drill
    if (existingDrill.creator_id !== user.id) {
      return NextResponse.json(
        { error: "You can only edit your own drills" },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const {
      name,
      slug: newSlug,
      description,
      objectives,
      difficulty,
      categories,
      tips,
      duration,
      videoUrl,
      videoStart,
      graph,
    } = body;

    // Validate required fields
    if (!name || !newSlug || !description || !graph) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if new slug already exists (if slug is changing)
    if (newSlug !== slug) {
      const conflictingDrill = await getDrillBySlug(newSlug);
      if (conflictingDrill) {
        return NextResponse.json(
          { error: "A drill with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Update the drill in the database
    const updatedDrill = await updateDrill(slug, {
      name,
      slug: newSlug,
      description,
      objectives,
      difficulty,
      categories,
      tips,
      duration,
      video_url: videoUrl,
      video_start: videoStart,
      graph,
    });

    if (!updatedDrill) {
      return NextResponse.json(
        { error: "Failed to update drill" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedDrill);
  } catch (error) {
    console.error("Error updating drill:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
