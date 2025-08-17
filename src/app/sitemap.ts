import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://ttdrills.co.uk";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sessions`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  // Dynamic drill pages
  let drillPages: MetadataRoute.Sitemap = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data: drills } = await supabase
        .from("drills")
        .select("slug, updated_at")
        .order("updated_at", { ascending: false })
        .limit(100); // Limit to most recent 100 drills for sitemap size

      if (drills) {
        drillPages = drills.map((drill) => ({
          url: `${baseUrl}/drills/${drill.slug}`,
          lastModified: new Date(drill.updated_at),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }));
      }
    }
  } catch (error) {
    console.error("Error fetching drills for sitemap:", error);
    // Continue without drill pages if there's an error
  }

  return [...staticPages, ...drillPages];
}
