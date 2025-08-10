"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Plus, X } from "lucide-react";

type Props = {
  data: {
    description: string;
    objectives: string[];
    tips: string[];
    duration: string;
    videoUrl: string;
    videoStart: string;
  };
  onChange: (
    field: string,
    value: string | string[] | number | undefined
  ) => void;
};

export const LimitedDrillFormMetadata = ({ data, onChange }: Props) => {
  const [newObjective, setNewObjective] = useState("");
  const [newTip, setNewTip] = useState("");

  const addObjective = () => {
    if (newObjective.trim()) {
      onChange("objectives", [...data.objectives, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    onChange(
      "objectives",
      data.objectives.filter((_, i) => i !== index)
    );
  };

  const addTip = () => {
    if (newTip.trim()) {
      onChange("tips", [...data.tips, newTip.trim()]);
      setNewTip("");
    }
  };

  const removeTip = (index: number) => {
    onChange(
      "tips",
      data.tips.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Description *
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-surface-light text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={3}
          placeholder="Describe the drill and what it focuses on..."
        />
      </div>

      {/* Objectives */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Learning Objectives
        </label>
        <div className="space-y-2">
          {data.objectives.map((objective, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => {
                  const newObjectives = [...data.objectives];
                  newObjectives[index] = e.target.value;
                  onChange("objectives", newObjectives);
                }}
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface-light text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter a learning objective..."
              />
              <Button
                onClick={() => removeObjective(index)}
                className="p-2 text-text-subtle hover:text-text"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addObjective()}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface-light text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Add a new learning objective..."
            />
            <Button
              onClick={addObjective}
              className="p-2 text-primary hover:text-primary-dark"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Coaching Tips
        </label>
        <div className="space-y-2">
          {data.tips.map((tip, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={tip}
                onChange={(e) => {
                  const newTips = [...data.tips];
                  newTips[index] = e.target.value;
                  onChange("tips", newTips);
                }}
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface-light text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter a coaching tip..."
              />
              <Button
                onClick={() => removeTip(index)}
                className="p-2 text-text-subtle hover:text-text"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTip}
              onChange={(e) => setNewTip(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTip()}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface-light text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Add a new coaching tip..."
            />
            <Button
              onClick={addTip}
              className="p-2 text-primary hover:text-primary-dark"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Estimated Duration (optional)
        </label>
        <input
          type="text"
          value={data.duration}
          onChange={(e) => onChange("duration", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-surface-light text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="e.g., 5-10 minutes"
        />
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          YouTube Video URL (optional)
        </label>
        <input
          type="url"
          value={data.videoUrl}
          onChange={(e) => onChange("videoUrl", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-surface-light text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      {/* Video Start Time */}
      {data.videoUrl && (
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Video Start Time (optional)
          </label>
          <input
            type="number"
            value={data.videoStart}
            onChange={(e) => onChange("videoStart", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface-light text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Number of seconds into the video"
            min="0"
          />
        </div>
      )}
    </div>
  );
};
