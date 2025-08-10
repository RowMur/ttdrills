"use client";

import { useState } from "react";

type Props = {
  videoUrl: string;
  title?: string;
  startTime?: number;
};

export const YouTubeVideo = ({ videoUrl, title, startTime }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  };

  const videoId = getVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className="bg-surface-light rounded-lg p-6 text-center">
        <p className="text-text-muted">
          Invalid YouTube URL. Please provide a valid YouTube video link.
        </p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}${
    startTime ? `?start=${startTime}` : ""
  }`;

  return (
    <div className="bg-surface-light rounded-lg p-4">
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-text">{title}</h3>
      )}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-light">
            <div className="text-text-muted">Loading video...</div>
          </div>
        )}
        <iframe
          src={embedUrl}
          title={title || "YouTube video"}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};
