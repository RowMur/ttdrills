"use client";

import { useEffect } from "react";

export const StartupSeeder = () => {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV === "production") {
      const seedDatabase = async () => {
        try {
          console.log("Triggering database seeding...");
          const response = await fetch("/api/startup");
          const result = await response.json();

          if (result.success) {
            console.log("Database seeding result:", result.message);
          } else {
            console.error("Database seeding failed:", result.error);
          }
        } catch (error) {
          console.error("Error during startup seeding:", error);
        }
      };

      // Run seeding after a short delay to ensure app is fully loaded
      const timeoutId = setTimeout(seedDatabase, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  // This component doesn't render anything
  return null;
};
