import posthog from "posthog-js";

// Initialize PostHog only if API key is provided
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
    // Capture page views automatically
    capture_pageview: true,
    // Capture clicks, form submissions, and page views
    capture_pageleave: true,
    // Disable in development if needed
    disable_session_recording: process.env.NODE_ENV === "development",
  });
} else if (typeof window !== "undefined") {
  // Mock PostHog for development/testing when no API key is provided
  console.log("PostHog not initialized - no API key provided");
}

export { posthog };
