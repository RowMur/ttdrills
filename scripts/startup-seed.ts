import { createClient } from "@supabase/supabase-js";
import { COMPREHENSIVE_DRILLS } from "../src/comprehensiveDrills";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables for database seeding");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // First, ensure the system user exists
    const { data: systemUser, error: userError } = await supabase
      .from("users")
      .upsert({
        id: "system",
        email: "system@tabletennisdrills.com",
        name: "System",
        image: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (userError) {
      console.error("Error creating system user:", userError);
      return;
    }

    console.log("System user ready");

    // Check if drills already exist
    const { data: existingDrills, error: checkError } = await supabase
      .from("drills")
      .select("slug")
      .eq("creator_id", "system");

    if (checkError) {
      console.error("Error checking existing drills:", checkError);
      return;
    }

    const existingSlugs = new Set(existingDrills?.map((d) => d.slug) || []);

    // Insert drills that don't already exist
    const drillsToInsert = COMPREHENSIVE_DRILLS.filter(
      (drill) => !existingSlugs.has(drill.slug)
    );

    if (drillsToInsert.length === 0) {
      console.log("All system drills already exist in database");
      return;
    }

    console.log(`Inserting ${drillsToInsert.length} new system drills...`);

    const { data: insertedDrills, error: insertError } = await supabase
      .from("drills")
      .insert(
        drillsToInsert.map((drill) => ({
          id: drill.id,
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
          creator_id: "system",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      )
      .select();

    if (insertError) {
      console.error("Error inserting drills:", insertError);
      return;
    }

    console.log(`Successfully seeded ${insertedDrills?.length || 0} drills`);
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}

// Only run in production
if (process.env.NODE_ENV === "production") {
  seedDatabase();
}
