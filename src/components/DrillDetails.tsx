import { difficultyDisplay, categoryDisplay } from "@/data";
import { Drill } from "@/types";
import { Clock, Target, Lightbulb, Award, Tag, Wrench } from "lucide-react";

type Props = {
  drill: Drill;
};

export const DrillDetails = ({ drill }: Props) => {
  return (
    <div className="bg-grey rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{drill.description}</p>
          </div>

          {/* Objectives */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Objectives
            </h3>
            <ul className="space-y-1">
              {drill.objectives.map((objective, index) => (
                <li
                  key={index}
                  className="text-gray-700 flex items-start gap-2"
                >
                  <span className="text-green-600 mt-1">•</span>
                  {objective}
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Coaching Tips
            </h3>
            <ul className="space-y-1">
              {drill.tips.map((tip, index) => (
                <li
                  key={index}
                  className="text-gray-700 flex items-start gap-2"
                >
                  <span className="text-yellow-600 mt-1">💡</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 text-grey sm:grid-cols-2 gap-4">
            {/* Difficulty */}
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium text-gray-600 mb-1 text-sm uppercase tracking-wide">
                Difficulty
              </h4>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    drill.difficulty === "beginner"
                      ? "bg-green-500"
                      : drill.difficulty === "intermediate"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="font-semibold">
                  {difficultyDisplay[drill.difficulty]}
                </span>
              </div>
            </div>

            {/* Duration */}
            {drill.duration && (
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-medium text-gray-600 mb-1 text-sm uppercase tracking-wide">
                  Duration
                </h4>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{drill.duration}</span>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg p-4 border text-grey">
            <h4 className="font-medium text-gray-600 mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {drill.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {categoryDisplay[category]}
                </span>
              ))}
            </div>
          </div>

          {/* Equipment */}
          {drill.equipment && drill.equipment.length > 0 && (
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium text-gray-600 mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Equipment Needed
              </h4>
              <div className="flex flex-wrap gap-2">
                {drill.equipment.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
