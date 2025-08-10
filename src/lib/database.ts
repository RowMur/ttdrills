import { supabase } from "./supabase";
import { Drill, StepGraph, DifficultyLevel, DrillCategory } from "@/types";

export type DatabaseUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type DatabaseDrill = {
  id: string;
  name: string;
  slug: string;
  description: string;
  objectives: string[];
  difficulty: string;
  categories: string[];
  tips: string[];
  duration: string | null;
  video_url: string | null;
  video_start: number | null;
  graph: StepGraph;
  creator_id: string;
  created_at: string;
  updated_at: string;
  creator?: DatabaseUser;
};

// User functions
export async function getUserByEmail(
  email: string
): Promise<DatabaseUser | null> {
  console.log("Looking up user by email:", email);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  console.log("Found user:", data?.email);
  return data;
}

export async function createUser(userData: {
  email: string;
  name: string;
  image?: string;
}): Promise<DatabaseUser | null> {
  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    return null;
  }

  return data;
}

export async function upsertUser(userData: {
  email: string;
  name: string;
  image?: string;
}): Promise<DatabaseUser | null> {
  console.log("Upserting user:", userData.email);

  const { data, error } = await supabase
    .from("users")
    .upsert([userData], { onConflict: "email" })
    .select()
    .single();

  if (error) {
    console.error("Error upserting user:", error);
    return null;
  }

  console.log("Successfully upserted user:", data?.email);
  return data;
}

// Drill functions
export async function createDrill(drillData: {
  name: string;
  slug: string;
  description: string;
  objectives: string[];
  difficulty: string;
  categories: string[];
  tips: string[];
  duration?: string;
  video_url?: string;
  video_start?: number;
  graph: StepGraph;
  creator_id: string;
}): Promise<DatabaseDrill | null> {
  const { data, error } = await supabase
    .from("drills")
    .insert([drillData])
    .select(
      `
      *,
      creator:users(id, name, email)
    `
    )
    .single();

  if (error) {
    console.error("Error creating drill:", error);
    return null;
  }

  return data;
}

export async function getDrillBySlug(
  slug: string
): Promise<DatabaseDrill | null> {
  const { data, error } = await supabase
    .from("drills")
    .select(
      `
      *,
      creator:users(id, name, email)
    `
    )
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching drill:", error);
    return null;
  }

  return data;
}

export async function getDrills(
  options: {
    search?: string;
    category?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<{ drills: DatabaseDrill[]; total: number }> {
  const { search, category, difficulty, page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;

  let query = supabase.from("drills").select(
    `
      *,
      creator:users(id, name, email)
    `,
    { count: "exact" }
  );

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (category) {
    query = query.contains("categories", [category]);
  }

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching drills:", error);
    return { drills: [], total: 0 };
  }

  return {
    drills: data || [],
    total: count || 0,
  };
}

export async function updateDrill(
  slug: string,
  drillData: {
    name: string;
    slug: string;
    description: string;
    objectives: string[];
    difficulty: string;
    categories: string[];
    tips: string[];
    duration?: string;
    video_url?: string;
    video_start?: number;
    graph: StepGraph;
  }
): Promise<DatabaseDrill | null> {
  const { data, error } = await supabase
    .from("drills")
    .update(drillData)
    .eq("slug", slug)
    .select(
      `
      *,
      creator:users(id, name, email)
    `
    )
    .single();

  if (error) {
    console.error("Error updating drill:", error);
    return null;
  }

  return data;
}

export async function deleteDrill(slug: string): Promise<boolean> {
  const { error } = await supabase.from("drills").delete().eq("slug", slug);

  if (error) {
    console.error("Error deleting drill:", error);
    return false;
  }

  return true;
}

// Transform database drill to app drill type
export function transformDatabaseDrill(dbDrill: DatabaseDrill): Drill {
  return {
    id: dbDrill.id,
    name: dbDrill.name,
    slug: dbDrill.slug,
    description: dbDrill.description,
    objectives: dbDrill.objectives,
    difficulty: dbDrill.difficulty as DifficultyLevel,
    categories: dbDrill.categories as DrillCategory[],
    tips: dbDrill.tips,
    duration: dbDrill.duration || undefined,
    videoUrl: dbDrill.video_url || undefined,
    videoStart: dbDrill.video_start || undefined,
    creatorId: dbDrill.creator_id,
    creator: dbDrill.creator
      ? {
          id: dbDrill.creator.id,
          email: dbDrill.creator.email,
          name: dbDrill.creator.name || "",
          image: dbDrill.creator.image || undefined,
        }
      : undefined,
    createdAt: new Date(dbDrill.created_at),
    updatedAt: new Date(dbDrill.updated_at),
    graph: dbDrill.graph,
  };
}
