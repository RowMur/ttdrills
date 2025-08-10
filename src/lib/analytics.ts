import { track } from "@vercel/analytics";

// Track drill views
export const trackDrillView = (
  drillName: string,
  drillSlug: string,
  difficulty: string,
  categories: string[]
) => {
  track("drill_view", {
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
  track("drill_created", {
    drill_name: drillName,
    difficulty,
    categories: categories.join(","),
    has_video: hasVideo,
  });
};

// Track drill editing
export const trackDrillEdit = (drillName: string, drillSlug: string) => {
  track("drill_edited", {
    drill_name: drillName,
    drill_slug: drillSlug,
  });
};

// Track drill deletion
export const trackDrillDeletion = (drillName: string, drillSlug: string) => {
  track("drill_deleted", {
    drill_name: drillName,
    drill_slug: drillSlug,
  });
};

// Track user sign in
export const trackSignIn = (method: string) => {
  track("user_signed_in", {
    method,
  });
};

// Track search queries
export const trackSearch = (query: string, resultsCount: number) => {
  track("search_performed", {
    query,
    results_count: resultsCount,
  });
};

// Track random drill selection
export const trackRandomDrill = (drillName: string, drillSlug: string) => {
  track("random_drill_selected", {
    drill_name: drillName,
    drill_slug: drillSlug,
  });
};

// Track timer usage
export const trackTimerStart = (duration: number) => {
  track("timer_started", {
    duration_seconds: duration,
  });
};

// Track timer completion
export const trackTimerComplete = (duration: number) => {
  track("timer_completed", {
    duration_seconds: duration,
  });
};

// Track video views
export const trackVideoView = (
  drillName: string,
  drillSlug: string,
  videoUrl: string
) => {
  track("video_viewed", {
    drill_name: drillName,
    drill_slug: drillSlug,
    video_url: videoUrl,
  });
};

// Track page views (for custom pages)
export const trackPageView = (page: string) => {
  track("page_view", {
    page,
  });
};

// Track user engagement metrics
export const trackUserEngagement = (
  action: string,
  details?: Record<string, string | number | boolean>
) => {
  track("user_engagement", {
    action,
    ...details,
  });
};
