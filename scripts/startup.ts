#!/usr/bin/env node

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runStartupTasks() {
  console.log("Running startup tasks...");

  // Run the seed script
  const seedScript = join(__dirname, "startup-seed.ts");

  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["tsx", seedScript], {
      stdio: "inherit",
      env: { ...process.env },
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log("Startup tasks completed successfully");
        resolve(0);
      } else {
        console.error(`Startup tasks failed with code ${code}`);
        reject(code);
      }
    });

    child.on("error", (error) => {
      console.error("Error running startup tasks:", error);
      reject(error);
    });
  });
}

// Only run in production
if (process.env.NODE_ENV === "production") {
  runStartupTasks().catch((error) => {
    console.error("Startup failed:", error);
    process.exit(1);
  });
}
