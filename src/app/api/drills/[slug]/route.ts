import { NextRequest, NextResponse } from "next/server";
import { getDrillBySlug } from "@/lib/database";

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
