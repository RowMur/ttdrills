#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing required environment variables for database migration"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log("Running sessions migration...");

    // Read the migration SQL file
    const migrationPath = join(
      __dirname,
      "../supabase/migrations/002_sessions.sql"
    );
    const migrationSQL = readFileSync(migrationPath, "utf8");

    // Execute the migration
    const { error } = await supabase.rpc("exec_sql", { sql: migrationSQL });

    if (error) {
      console.error("Error running migration:", error);
      return;
    }

    console.log("Sessions migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  }
}

runMigration();
