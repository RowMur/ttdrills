import { difficultyDisplay, categoryDisplay } from "@/data";
import { Drill } from "@/types";
import { Clock, Target, Lightbulb, Award, Wrench } from "lucide-react";

type Props = {
  drill: Drill;
};

export const DrillDetails = ({ drill }: Props) => {
  return (
    <div className="bg-grey rounded-lg p-6 mb-6">
      <div className="space-y-6">
        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-white">
            <Target className="w-5 h-5 text-white" />
            Description
          </h3>
          <p className="text-white leading-relaxed">{drill.description}</p>
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap gap-4 items-center text-sm">
          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">Difficulty:</span>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  drill.difficulty === "beginner"
                    ? "bg-green"
                    : drill.difficulty === "intermediate"
                    ? "bg-light-grey"
                    : "bg-red"
                }`}
              />
              <span className="text-white font-medium">
                {difficultyDisplay[drill.difficulty]}
              </span>
            </div>
          </div>

          {/* Duration */}
          {drill.duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white">{drill.duration}</span>
            </div>
          )}

          {/* Categories */}
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">Categories:</span>
            <div className="flex flex-wrap gap-1">
              {drill.categories.map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 bg-table-blue text-white rounded text-xs font-medium"
                >
                  {categoryDisplay[category]}
                </span>
              ))}
            </div>
          </div>

          {/* Equipment */}
          {drill.equipment && drill.equipment.length > 0 && (
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-white" />
              <span className="text-white">
                {drill.equipment
                  .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
                  .join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Objectives */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-white">
            <Award className="w-5 h-5 text-white" />
            Objectives
          </h3>
          <ul className="space-y-1">
            {drill.objectives.map((objective, index) => (
              <li key={index} className="text-white flex items-start gap-2">
                <span className="text-white mt-1">•</span>
                {objective}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-white">
            <Lightbulb className="w-5 h-5 text-white" />
            Coaching Tips
          </h3>
          <ul className="space-y-1">
            {drill.tips.map((tip, index) => (
              <li key={index} className="text-white flex items-start gap-2">
                <span className="text-white mt-1">💡</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
