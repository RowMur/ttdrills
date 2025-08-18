import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    if (!slug) {
      return NextResponse.json(
        { error: "Invalid drill name" },
        { status: 400 }
      );
    }

    // Check if slug exists in database
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: existingDrill, error } = await supabase
      .from("drills")
      .select("id, name, slug, description")
      .eq("slug", slug)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected
      console.error("Error checking drill name:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (existingDrill) {
      return NextResponse.json({
        exists: true,
        drill: {
          id: existingDrill.id,
          name: existingDrill.name,
          slug: existingDrill.slug,
          description: existingDrill.description,
        },
      });
    }

    // Also check for similar names (fuzzy matching)
    const { data: similarDrills, error: similarError } = await supabase
      .from("drills")
      .select("id, name, slug, description")
      .or(`name.ilike.%${name}%,name.ilike.${name}%,name.ilike.%${name}`)
      .limit(5);

    if (similarError) {
      console.error("Error checking similar drills:", similarError);
      // Don't fail the request for similar drill check
    }

    return NextResponse.json({
      exists: false,
      slug,
      similarDrills: similarDrills || [],
    });
  } catch (error) {
    console.error("Error in check-name endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
