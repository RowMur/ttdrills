import { posthog } from "./posthog";

// Helper function to safely capture events
const safeCapture = (
  event: string,
  properties?: Record<string, string | number | boolean>
) => {
  try {
    // Only capture if PostHog is properly initialized
    if (posthog && typeof posthog.capture === "function") {
      posthog.capture(event, properties);
    } else {
      // Log events in development when PostHog isn't initialized
      if (process.env.NODE_ENV === "development") {
        console.log("PostHog Event:", event, properties);
      }
    }
  } catch (error) {
    // Silently fail in production, log in development
    if (process.env.NODE_ENV === "development") {
      console.warn("PostHog capture failed:", error);
    }
  }
};

// Track drill views
export const trackDrillView = (
  drillName: string,
  drillSlug: string,
  difficulty: string,
  categories: string[]
) => {
  safeCapture("drill_view", {
    drill_name: drillName,
    drill_slug: drillSlug,
    difficulty,
    categories: categories.join(","),
  });
};

// Track drill creation
export const trackDrillCreation = (
  drillName: string,
  difficulty: string,
  categories: string[],
  hasVideo: boolean
) => {
  safeCapture("drill_created", {
    drill_name: drillName,
    difficulty,
    categories: categories.join(","),
    has_video: hasVideo,
  });
};

// Track drill editing
export const trackDrillEdit = (drillName: string, drillSlug: string) => {
  safeCapture("drill_edited", {
    drill_name: drillName,
    drill_slug: drillSlug,
  });
};

// Track drill deletion
export const trackDrillDeletion = (drillName: string, drillSlug: string) => {
  safeCapture("drill_deleted", {
    drill_name: drillName,
    drill_slug: drillSlug,
  });
};

// Track user sign in
export const trackSignIn = (method: string) => {
  safeCapture("user_signed_in", {
    method,
  });
};

// Track search queries
export const trackSearch = (query: string, resultsCount: number) => {
  safeCapture("search_performed", {
    query,
    results_count: resultsCount,
  });
};

// Track random drill selection
export const trackRandomDrill = (drillName: string, drillSlug: string) => {
  safeCapture("random_drill_selected", {
    drill_name: drillName,
    drill_slug: drillSlug,
  });
};

// Track timer usage
export const trackTimerStart = (duration: number) => {
  safeCapture("timer_started", {
    duration_seconds: duration,
  });
};

// Track timer completion
export const trackTimerComplete = (duration: number) => {
  safeCapture("timer_completed", {
    duration_seconds: duration,
  });
};

// Track video views
export const trackVideoView = (
  drillName: string,
  drillSlug: string,
  videoUrl: string
) => {
  safeCapture("video_viewed", {
    drill_name: drillName,
    drill_slug: drillSlug,
    video_url: videoUrl,
  });
};

// Track page views (for custom pages)
export const trackPageView = (page: string) => {
  safeCapture("page_view", {
    page,
  });
};

// Track user engagement metrics
export const trackUserEngagement = (
  action: string,
  details?: Record<string, string | number | boolean>
) => {
  safeCapture("user_engagement", {
    action,
    ...details,
  });
};
