"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { trackTimerStart, trackTimerComplete } from "@/lib/analytics";
import { Play, Pause, RotateCcw } from "lucide-react";

export const SimpleTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputSeconds, setInputSeconds] = useState("60");
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);

            // Track timer completion
            trackTimerComplete(parseInt(inputSeconds) || 60);

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    const seconds = parseInt(inputSeconds) || 60;
    setTimeLeft(seconds);
    setIsRunning(true);

    // Track timer start
    trackTimerStart(seconds);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-center space-y-6 transition-all duration-500">
      {/* Time Input */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Time (seconds)
        </label>
        <input
          type="number"
          min="1"
          max="3600"
          value={inputSeconds}
          onChange={(e) => setInputSeconds(e.target.value)}
          disabled={isRunning}
          className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg"
        />
      </div>

      {/* Timer Display */}
      <div>
        <div
          className={`font-bold mb-2 ${
            isCompleted ? "text-white text-8xl" : "text-primary text-6xl"
          }`}
        >
          {isCompleted ? "DONE!" : formatTime(timeLeft)}
        </div>
        <div
          className={`${
            isCompleted
              ? "text-text-muted text-2xl font-bold"
              : "text-text-subtle text-sm"
          }`}
        >
          {isCompleted
            ? "TIME'S UP!"
            : isRunning
            ? "Running..."
            : timeLeft > 0
            ? "Paused"
            : "Ready"}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {timeLeft === 0 && !isCompleted ? (
          <Button
            onClick={startTimer}
            className="bg-success text-white hover:bg-success-dark px-6 py-3 rounded-lg font-medium flex items-center"
          >
            <Play className="w-4 h-4 mr-2" />
            Start
          </Button>
        ) : timeLeft === 0 && isCompleted ? (
          <Button
            onClick={resetTimer}
            className="bg-surface text-text hover:bg-surface-light px-6 py-3 rounded-lg font-medium flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        ) : (
          <>
            {isRunning ? (
              <Button
                onClick={pauseTimer}
                className="bg-warning text-white hover:bg-warning-dark px-6 py-3 rounded-lg font-medium flex items-center"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            ) : (
              <Button
                onClick={startTimer}
                className="bg-success text-white hover:bg-success-dark px-6 py-3 rounded-lg font-medium flex items-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}
            <Button
              onClick={resetTimer}
              className="bg-surface-light text-text-subtle hover:text-text px-6 py-3 rounded-lg font-medium flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
