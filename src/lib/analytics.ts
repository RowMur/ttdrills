import { posthog } from "./posthog";

// Helper function to safely capture events
const safeCapture = (
  event: string,
  properties?: Record<string, string | number | boolean>
) => {
  console.log("PostHog Event:", event, properties);
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

// Track video play (when user actually clicks play)
export const trackVideoPlay = (
  drillName: string,
  drillSlug: string,
  videoUrl: string
) => {
  safeCapture("video_played", {
    drill_name: drillName,
    drill_slug: drillSlug,
    video_url: videoUrl,
  });
};

// Track session creation
export const trackSessionCreation = (
  sessionName: string,
  hasDrills: boolean,
  drillCount: number,
  hasNotes: boolean,
  durationMinutes?: number
) => {
  safeCapture("session_created", {
    session_name: sessionName,
    has_drills: hasDrills,
    drill_count: drillCount,
    duration_minutes: durationMinutes || 0,
    has_notes: hasNotes,
  });
};

// Track session deletion
export const trackSessionDeletion = (
  sessionName: string,
  sessionId: string,
  drillCount: number
) => {
  safeCapture("session_deleted", {
    session_name: sessionName,
    session_id: sessionId,
    drill_count: drillCount,
  });
};

// Note: Removed ai_recommendations_viewed event as it doesn't provide meaningful insights
// Users might scroll past without engaging. Better to track actual interactions like:
// - ai_recommendation_selected
// - session_from_ai
// - ai_recommendations_expanded (if we add this feature)

// Track AI recommendation selected
export const trackAIRecommendationSelected = (
  drillName: string,
  drillSlug: string,
  priority: string,
  reason: string
) => {
  safeCapture("ai_recommendation_selected", {
    drill_name: drillName,
    drill_slug: drillSlug,
    priority,
    reason,
  });
};

// Track session logging from AI recommendations
export const trackSessionFromAI = (
  drillCount: number,
  selectedDrills: string[]
) => {
  safeCapture("session_from_ai_recommendations", {
    drill_count: drillCount,
    selected_drills: selectedDrills.join(","),
  });
};

// Track practice session logging (sessions without drills)
export const trackPracticeSession = (
  sessionName: string,
  hasNotes: boolean,
  durationMinutes?: number
) => {
  safeCapture("practice_session_logged", {
    session_name: sessionName,
    duration_minutes: durationMinutes || 0,
    has_notes: hasNotes,
  });
};

// Track drill rating in sessions
export const trackDrillRating = (
  drillName: string,
  drillSlug: string,
  rating: number,
  sessionName: string
) => {
  safeCapture("drill_rated", {
    drill_name: drillName,
    drill_slug: drillSlug,
    rating,
    session_name: sessionName,
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

// Track AI cache operations
export const trackAICacheHit = (cacheType: string) => {
  safeCapture("ai_cache_hit", {
    cache_type: cacheType,
  });
};

export const trackAICacheMiss = (cacheType: string) => {
  safeCapture("ai_cache_miss", {
    cache_type: cacheType,
  });
};

// Track AI API errors
export const trackAIError = (errorType: string, errorMessage: string) => {
  safeCapture("ai_error", {
    error_type: errorType,
    error_message: errorMessage,
  });
};
