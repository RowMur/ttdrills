import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createDrill, getDrills, getUserByEmail } from "@/lib/database";

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
    const body = await request.json();
    const {
      name,
      slug,
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
    if (!name || !slug || !description || !graph) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the drill in the database
    const drill = await createDrill({
      name,
      slug,
      description,
      objectives,
      difficulty,
      categories,
      tips,
      duration,
      video_url: videoUrl,
      video_start: videoStart,
      graph,
      creator_id: user.id,
    });

    if (!drill) {
      return NextResponse.json(
        { error: "Failed to create drill" },
        { status: 500 }
      );
    }

    return NextResponse.json(drill, { status: 201 });
  } catch (error) {
    console.error("Error creating drill:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const difficulty = searchParams.get("difficulty") || "";

    const result = await getDrills({
      search,
      category,
      difficulty,
      page,
      limit,
    });

    return NextResponse.json({
      drills: result.drills,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching drills:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
