import { difficultyDisplay, categoryDisplay } from "@/data";
import { Drill } from "@/types";
import { Clock, Target, Lightbulb, Award, Play } from "lucide-react";
import { YouTubeVideo } from "@/components/YouTubeVideo";

type Props = {
  drill: Drill;
};

export const DrillDetails = ({ drill }: Props) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="space-y-6">
        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-text">
            <Target className="w-5 h-5 text-primary" />
            Description
          </h3>
          <p className="text-text-muted leading-relaxed">{drill.description}</p>
        </div>

        {/* Video */}
        {drill.videoUrl && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-text">
              <Play className="w-5 h-5 text-danger" />
              Video Demonstration
            </h3>
            <YouTubeVideo videoUrl={drill.videoUrl} />
          </div>
        )}

        {/* Metadata Row */}
        <div className="flex flex-wrap gap-4 items-center text-sm">
          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="text-text font-medium">Difficulty:</span>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  drill.difficulty === "beginner"
                    ? "bg-success"
                    : drill.difficulty === "intermediate"
                    ? "bg-warning"
                    : "bg-danger"
                }`}
              />
              <span className="text-text font-medium">
                {difficultyDisplay[drill.difficulty]}
              </span>
            </div>
          </div>

          {/* Duration */}
          {drill.duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-text-muted">{drill.duration}</span>
            </div>
          )}

          {/* Categories */}
          {drill.categories.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-text font-medium">Categories:</span>
              <div className="flex flex-wrap gap-1">
                {drill.categories.map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-primary text-white rounded text-xs font-medium"
                  >
                    {categoryDisplay[category]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Objectives and Tips - Side by side on larger screens */}
        {(drill.objectives.length > 0 || drill.tips.length > 0) && (
          <div
            className={`grid gap-6 ${
              drill.objectives.length > 0 && drill.tips.length > 0
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {/* Objectives */}
            {drill.objectives.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-text">
                  <Award className="w-5 h-5 text-success" />
                  Objectives
                </h3>
                <ul className="space-y-1">
                  {drill.objectives.map((objective, index) => (
                    <li
                      key={index}
                      className="text-text-muted flex items-start gap-2"
                    >
                      <span className="text-success">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {drill.tips.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-text">
                  <Lightbulb className="w-5 h-5 text-warning" />
                  Coaching Tips
                </h3>
                <ul className="space-y-1">
                  {drill.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-text-muted flex items-start gap-2"
                    >
                      <span className="text-warning">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
