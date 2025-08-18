import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://ttdrills.co.uk";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/auth/",
          "/api/sessions/",
          "/api/drills/",
          "/auth/",
          "/sessions/",
          "/create/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
