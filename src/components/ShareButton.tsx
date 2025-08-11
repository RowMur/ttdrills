"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";

type Props = {
  drillSlug: string;
};

export const ShareButton = ({ drillSlug }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/drills/${drillSlug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = `${window.location.origin}/drills/${drillSlug}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <Button
      onClick={handleShare}
      className="flex items-center gap-2 px-3 py-2 bg-info text-white rounded-lg hover:bg-info-dark transition-colors font-medium"
    >
      {copied ? (
        <>
          <Check size={16} />
          <span className="hidden md:inline">Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={16} />
          <span className="hidden md:inline">Share</span>
        </>
      )}
    </Button>
  );
};
