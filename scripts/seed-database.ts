import { createClient } from "@supabase/supabase-js";
import { COMPREHENSIVE_DRILLS } from "../src/comprehensiveDrills";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log("Starting database seed...");

  // Create a system user for the existing drills
  const { data: systemUser, error: userError } = await supabase
    .from("users")
    .upsert(
      {
        id: "00000000-0000-0000-0000-000000000000",
        email: "system@tabletennisdrills.com",
        name: "System",
        image: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (userError) {
    console.error("Error creating system user:", userError);
    return;
  }

  console.log("System user created/updated:", systemUser.email);

  // Seed drills
  for (const drill of COMPREHENSIVE_DRILLS) {
    try {
      const { data: existingDrill } = await supabase
        .from("drills")
        .select("id")
        .eq("slug", drill.slug)
        .single();

      if (existingDrill) {
        console.log(`Drill "${drill.name}" already exists, skipping...`);
        continue;
      }

      const { data: createdDrill, error } = await supabase
        .from("drills")
        .insert({
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
          creator_id: systemUser.id,
        })
        .select()
        .single();

      if (error) {
        console.error(`Error creating drill "${drill.name}":`, error);
      } else {
        console.log(`Created drill: "${createdDrill.name}"`);
      }
    } catch (error) {
      console.error(`Error processing drill "${drill.name}":`, error);
    }
  }

  console.log("Database seeding completed!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
