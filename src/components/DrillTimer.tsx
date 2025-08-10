"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/Button";
import { ControlButton } from "@/components/ControlButton";
import { Play, Pause, RotateCcw, Settings, Timer } from "lucide-react";
import { Drill } from "@/types";

type TimerMode = "work" | "rest" | "completed";

interface TimerSettings {
  workDuration: number; // seconds
  restDuration: number; // seconds
  rounds: number;
  autoStart: boolean;
}

type Props = {
  drill: Drill;
};

export const DrillTimer = ({ drill }: Props) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [mode, setMode] = useState<TimerMode>("work");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: 60, // 1 minute default
    restDuration: 30, // 30 seconds default
    rounds: 3, // 3 rounds default
    autoStart: false,
  });

  const handleTimerComplete = useCallback(() => {
    if (mode === "work") {
      if (currentRound < settings.rounds) {
        // Start rest period
        setMode("rest");
        setTimeLeft(settings.restDuration);
        if (settings.autoStart) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
        }
      } else {
        // All rounds completed
        setMode("completed");
        setIsRunning(false);
      }
    } else if (mode === "rest") {
      // Rest period finished, start next work round
      setCurrentRound((prev) => prev + 1);
      setMode("work");
      setTimeLeft(settings.workDuration);
      if (settings.autoStart) {
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    }
  }, [mode, currentRound, settings]);

  // Initialize timer
  useEffect(() => {
    setTimeLeft(settings.workDuration);
  }, [settings.workDuration]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, handleTimerComplete]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentRound(1);
    setMode("work");
    setTimeLeft(settings.workDuration);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getModeColor = (): string => {
    switch (mode) {
      case "work":
        return "text-primary";
      case "rest":
        return "text-warning";
      case "completed":
        return "text-success";
      default:
        return "text-text";
    }
  };

  const getModeText = (): string => {
    switch (mode) {
      case "work":
        return "Work";
      case "rest":
        return "Rest";
      case "completed":
        return "Completed!";
      default:
        return "";
    }
  };

  const getProgressPercentage = (): number => {
    const totalTime =
      mode === "work" ? settings.workDuration : settings.restDuration;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Practice Timer
        </h3>
        <Button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-text-subtle hover:text-text"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-surface-light rounded-lg space-y-4">
          <h4 className="font-medium text-text">Timer Settings</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Work Duration (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="600"
                value={settings.workDuration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    workDuration: parseInt(e.target.value) || 60,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Rest Duration (seconds)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                value={settings.restDuration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    restDuration: parseInt(e.target.value) || 30,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Rounds
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.rounds}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    rounds: parseInt(e.target.value) || 3,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-text">
                <input
                  type="checkbox"
                  checked={settings.autoStart}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      autoStart: e.target.checked,
                    }))
                  }
                  className="rounded border-border focus:ring-primary"
                />
                Auto-start rounds
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold mb-2 ${getModeColor()}`}>
          {formatTime(timeLeft)}
        </div>
        <div className={`text-lg font-medium ${getModeColor()}`}>
          {getModeText()}
        </div>
        <div className="text-sm text-text-subtle mt-1">
          Round {currentRound} of {settings.rounds}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-surface-light rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {mode === "completed" ? (
          <Button
            onClick={resetTimer}
            className="bg-success text-white hover:bg-success-dark px-6 py-3 rounded-lg font-medium"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        ) : (
          <>
            {isRunning ? (
              <ControlButton
                onClick={pauseTimer}
                className="bg-warning text-white"
              >
                <Pause className="w-4 h-4" />
              </ControlButton>
            ) : (
              <ControlButton
                onClick={startTimer}
                className="bg-success text-white"
              >
                <Play className="w-4 h-4" />
              </ControlButton>
            )}
            <ControlButton
              onClick={resetTimer}
              className="bg-surface-light text-text-subtle"
            >
              <RotateCcw className="w-4 h-4" />
            </ControlButton>
          </>
        )}
      </div>

      {/* Drill Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-sm text-text-subtle">
          <div className="flex justify-between">
            <span>Drill:</span>
            <span className="font-medium text-text">{drill.name}</span>
          </div>
          {drill.duration && (
            <div className="flex justify-between">
              <span>Estimated Duration:</span>
              <span className="font-medium text-text">{drill.duration}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Difficulty:</span>
            <span className="font-medium text-text">{drill.difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
