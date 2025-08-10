import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { COMPREHENSIVE_DRILLS } from "@/comprehensiveDrills";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables for database seeding");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // First, ensure the system user exists
    const { error: userError } = await supabase
      .from("users")
      .upsert({
        id: "00000000-0000-0000-0000-000000000000",
        email: "system@ttdrills.com",
        name: "System",
        image: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (userError) {
      console.error("Error creating system user:", userError);
      return { success: false, error: "Failed to create system user" };
    }

    console.log("System user ready");

    // Check if drills already exist
    const { data: existingDrills, error: checkError } = await supabase
      .from("drills")
      .select("slug")
      .eq("creator_id", "00000000-0000-0000-0000-000000000000");

    if (checkError) {
      console.error("Error checking existing drills:", checkError);
      return { success: false, error: "Failed to check existing drills" };
    }

    const existingSlugs = new Set(existingDrills?.map((d) => d.slug) || []);

    // Insert drills that don't already exist
    const drillsToInsert = COMPREHENSIVE_DRILLS.filter(
      (drill) => !existingSlugs.has(drill.slug)
    );

    if (drillsToInsert.length === 0) {
      console.log("All system drills already exist in database");
      return { success: true, message: "All drills already exist", count: 0 };
    }

    console.log(`Inserting ${drillsToInsert.length} new system drills...`);

    const { data: insertedDrills, error: insertError } = await supabase
      .from("drills")
      .insert(
        drillsToInsert.map((drill) => ({
          name: drill.name,
          slug: drill.slug,
          description: drill.description,
          objectives: drill.objectives,
          difficulty: drill.difficulty,
          categories: drill.categories,
          tips: drill.tips,
          duration: drill.duration,
          video_url: drill.videoUrl,
          video_start: drill.videoStart,
          graph: drill.graph,
          creator_id: "00000000-0000-0000-0000-000000000000",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      )
      .select();

    if (insertError) {
      console.error("Error inserting drills:", insertError);
      return { success: false, error: "Failed to insert drills" };
    }

    console.log(`Successfully seeded ${insertedDrills?.length || 0} drills`);
    return {
      success: true,
      message: `Successfully seeded ${insertedDrills?.length || 0} drills`,
      count: insertedDrills?.length || 0,
    };
  } catch (error) {
    console.error("Error during database seeding:", error);
    return { success: false, error: "Unexpected error during seeding" };
  }
}

export async function GET() {
  // Only allow seeding in production or with a secret key
  if (process.env.NODE_ENV !== "production" && !process.env.SEED_SECRET_KEY) {
    return NextResponse.json(
      { error: "Seeding not allowed in development" },
      { status: 403 }
    );
  }

  const result = await seedDatabase();

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(result, { status: 500 });
  }
}
