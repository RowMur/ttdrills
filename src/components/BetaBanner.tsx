"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

export function BetaBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner
    const hasDismissed = localStorage.getItem("beta-banner-dismissed");
    if (!hasDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("beta-banner-dismissed", "true");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-warning/10 border-b border-warning/20">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-warning" size={20} />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text">
                🚧 Beta Version
              </span>
              <span className="text-sm text-text-subtle">
                This app is in early development. Features may change and bugs
                may exist.
              </span>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-text-muted hover:text-text transition-colors"
            aria-label="Dismiss banner"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
