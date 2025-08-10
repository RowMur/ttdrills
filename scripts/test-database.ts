import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  console.log("Testing Supabase connection...");
  console.log("URL:", supabaseUrl);
  console.log("Anon Key:", supabaseAnonKey ? "Present" : "Missing");

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Connection error:", error);
      return;
    }

    console.log("✅ Database connection successful");

    // Test user creation
    const testUser = {
      email: "test@example.com",
      name: "Test User",
    };

    console.log("Testing user creation...");
    const { data: createdUser, error: createError } = await supabase
      .from("users")
      .upsert([testUser], { onConflict: "email" })
      .select()
      .single();

    if (createError) {
      console.error("❌ User creation failed:", createError);
    } else {
      console.log("✅ User creation successful:", createdUser.email);
    }

    // Test user lookup
    console.log("Testing user lookup...");
    const { data: foundUser, error: lookupError } = await supabase
      .from("users")
      .select("*")
      .eq("email", "test@example.com")
      .single();

    if (lookupError) {
      console.error("❌ User lookup failed:", lookupError);
    } else {
      console.log("✅ User lookup successful:", foundUser.email);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testDatabase().catch(console.error);
