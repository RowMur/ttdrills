"use client";

import { DrillCard } from "@/components/DrillCard";
import { DRILLS } from "@/data";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Table Tennis Drills
      </h1>
      <div className="flex gap-4">
        {DRILLS.map((drill) => (
          <DrillCard key={drill.name} drill={drill} />
        ))}
      </div>
    </main>
  );
}
