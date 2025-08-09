"use client";

import { DifficultyLevel, DrillCategory } from "@/types";
import { difficultyDisplay, categoryDisplay } from "@/data";
import { Plus, X } from "lucide-react";

type Props = {
  data: {
    name: string;
    description: string;
    objectives: string[];
    difficulty: DifficultyLevel;
    categories: DrillCategory[];
    tips: string[];
    duration: string;
    equipment: string[];
  };
  onChange: (
    field: string,
    value: string | string[] | DifficultyLevel | DrillCategory[]
  ) => void;
};

export const DrillFormMetadata = ({ data, onChange }: Props) => {
  const addArrayItem = (field: string) => {
    onChange(field, [...(data[field as keyof typeof data] as string[]), ""]);
  };

  const removeArrayItem = (field: string, index: number) => {
    const items = [...(data[field as keyof typeof data] as string[])];
    items.splice(index, 1);
    onChange(field, items);
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    const items = [...(data[field as keyof typeof data] as string[])];
    items[index] = value;
    onChange(field, items);
  };

  const toggleCategory = (category: DrillCategory) => {
    const categories = data.categories.includes(category)
      ? data.categories.filter((c) => c !== category)
      : [...data.categories, category];
    onChange("categories", categories);
  };

  const toggleEquipment = (equipment: string) => {
    const equipmentList = data.equipment.includes(equipment)
      ? data.equipment.filter((e) => e !== equipment)
      : [...data.equipment, equipment];
    onChange("equipment", equipmentList);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Drill Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full p-3 rounded-lg bg-surface-light text-text border border-border focus:border-primary focus:outline-none"
            placeholder="Enter drill name..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Duration (optional)
          </label>
          <input
            type="text"
            value={data.duration}
            onChange={(e) => onChange("duration", e.target.value)}
            className="w-full p-3 rounded-lg bg-surface-light text-text border border-border focus:border-primary focus:outline-none"
            placeholder="e.g., 5-10 minutes"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Description *
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
          className="w-full p-3 rounded-lg bg-surface-light text-text border border-border focus:border-primary focus:outline-none resize-none"
          placeholder="Describe what this drill teaches and how it works..."
        />
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Difficulty *
        </label>
        <div className="flex gap-3">
          {(Object.keys(difficultyDisplay) as DifficultyLevel[]).map(
            (level) => (
              <button
                key={level}
                type="button"
                onClick={() => onChange("difficulty", level)}
                className={`px-4 py-2 rounded-lg border font-medium ${
                  data.difficulty === level
                    ? level === "beginner"
                      ? "bg-success border-success text-white"
                      : level === "intermediate"
                      ? "bg-warning border-warning text-white"
                      : "bg-danger border-danger text-white"
                    : "bg-transparent border-border text-text hover:border-text"
                }`}
              >
                {difficultyDisplay[level]}
              </button>
            )
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Categories * (select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(Object.keys(categoryDisplay) as DrillCategory[]).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                data.categories.includes(category)
                  ? "bg-primary border-primary text-white"
                  : "bg-transparent border-border text-text hover:border-text"
              }`}
            >
              {categoryDisplay[category]}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Equipment (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {["multiball", "robot", "partner", "net", "cones"].map(
            (equipment) => (
              <button
                key={equipment}
                type="button"
                onClick={() => toggleEquipment(equipment)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border capitalize ${
                  data.equipment.includes(equipment)
                    ? "bg-surface border-surface text-white"
                    : "bg-transparent border-border text-text hover:border-text"
                }`}
              >
                {equipment}
              </button>
            )
          )}
        </div>
      </div>

      {/* Objectives */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Learning Objectives *
        </label>
        <div className="space-y-2">
          {data.objectives.map((objective, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={objective}
                onChange={(e) =>
                  updateArrayItem("objectives", index, e.target.value)
                }
                className="flex-1 p-3 rounded-lg bg-surface-light text-text border border-border focus:border-primary focus:outline-none"
                placeholder="Enter learning objective..."
              />
              {data.objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("objectives", index)}
                  className="p-3 rounded-lg bg-danger text-white hover:bg-danger-dark"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("objectives")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4" />
            Add Objective
          </button>
        </div>
      </div>

      {/* Tips */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Coaching Tips *
        </label>
        <div className="space-y-2">
          {data.tips.map((tip, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={tip}
                onChange={(e) => updateArrayItem("tips", index, e.target.value)}
                className="flex-1 p-3 rounded-lg bg-surface-light text-text border border-border focus:border-primary focus:outline-none"
                placeholder="Enter coaching tip..."
              />
              {data.tips.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("tips", index)}
                  className="p-3 rounded-lg bg-danger text-white hover:bg-danger-dark"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("tips")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4" />
            Add Tip
          </button>
        </div>
      </div>
    </div>
  );
};
