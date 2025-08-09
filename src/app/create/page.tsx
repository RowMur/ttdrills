"use client";

import { useState } from "react";
import { Main } from "@/components/Main";
import { DrillFormMetadata } from "@/components/DrillFormMetadata";
import { DrillFormSequence } from "@/components/DrillFormSequence";
import { Button } from "@/components/Button";
import { Drill, DifficultyLevel, DrillCategory, StepGraph } from "@/types";

export default function CreateDrillPage() {
  const [drillData, setDrillData] = useState({
    name: "",
    description: "",
    objectives: [""],
    difficulty: "beginner" as DifficultyLevel,
    categories: [] as DrillCategory[],
    tips: [""],
    duration: "",
    equipment: [] as string[],
  });

  const [ballSequence, setBallSequence] = useState<StepGraph>({
    entryPoint: "",
    nodes: {},
  });

  const handleMetadataChange = (
    field: string,
    value: string | string[] | DifficultyLevel | DrillCategory[]
  ) => {
    setDrillData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSequenceChange = (sequence: StepGraph) => {
    setBallSequence(sequence);
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleCreateDrill = () => {
    // Filter out empty objectives and tips
    const cleanObjectives = drillData.objectives.filter(
      (obj) => obj.trim() !== ""
    );
    const cleanTips = drillData.tips.filter((tip) => tip.trim() !== "");
    const cleanEquipment = drillData.equipment.filter((eq) => eq.trim() !== "");

    const drill: Drill = {
      name: drillData.name,
      slug: generateSlug(drillData.name),
      description: drillData.description,
      objectives: cleanObjectives,
      difficulty: drillData.difficulty,
      categories: drillData.categories,
      tips: cleanTips,
      ...(drillData.duration && { duration: drillData.duration }),
      ...(cleanEquipment.length > 0 && { equipment: cleanEquipment }),
      graph: ballSequence,
    };

    console.log("Generated Drill Object:");
    console.log(JSON.stringify(drill, null, 2));

    alert(
      "Drill object has been logged to console! Check the browser developer tools."
    );
  };

  const isFormValid = () => {
    return (
      drillData.name.trim() !== "" &&
      drillData.description.trim() !== "" &&
      drillData.objectives.some((obj) => obj.trim() !== "") &&
      drillData.categories.length > 0 &&
      drillData.tips.some((tip) => tip.trim() !== "") &&
      ballSequence.entryPoint !== "" &&
      Object.keys(ballSequence.nodes).length > 0
    );
  };

  return (
    <Main>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-text">
          Create New Drill
        </h1>

        <div className="space-y-8">
          {/* Drill Metadata Form */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-text">
              Drill Information
            </h2>
            <DrillFormMetadata
              data={drillData}
              onChange={handleMetadataChange}
            />
          </div>

          {/* Ball Sequence Builder */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-text">
              Ball Sequence
            </h2>
            <DrillFormSequence
              sequence={ballSequence}
              onChange={handleSequenceChange}
            />
          </div>

          {/* Create Button */}
          <div className="text-center">
            <Button
              onClick={handleCreateDrill}
              disabled={!isFormValid()}
              className={`px-8 py-3 rounded-lg font-semibold ${
                isFormValid()
                  ? "bg-success text-white hover:bg-success-dark"
                  : "bg-surface-light text-text-subtle cursor-not-allowed"
              }`}
            >
              Create Drill (Console Log)
            </Button>
            {!isFormValid() && (
              <p className="text-text-subtle text-sm mt-2">
                Please fill in all required fields and create at least one ball
                sequence
              </p>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
}
