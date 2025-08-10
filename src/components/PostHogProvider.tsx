"use client";

export const PostHogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // PostHog is initialized in src/lib/posthog.ts
  // This provider can be expanded later for user identification
  return <>{children}</>;
};
