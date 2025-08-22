# TTDrills Analytics Setup

## Overview

TTDrills uses a hybrid analytics approach combining **Vercel Analytics** for automatic page view tracking and **PostHog** for custom event tracking. This setup provides the best of both worlds - Vercel's seamless page view tracking and PostHog's generous free tier for custom events.

## 🚀 **Analytics Architecture**

### **Vercel Analytics** - Page Views

- ✅ **Automatic Page Views**: Tracks all page visits automatically
- ✅ **Performance Metrics**: Core Web Vitals, page load times
- ✅ **Real-time Dashboard**: Available in Vercel project dashboard
- ✅ **No Configuration**: Works out of the box

### **PostHog** - Custom Events

- ✅ **Custom Event Tracking**: All user interactions
- ✅ **Generous Free Tier**: 1M events/month free
- ✅ **Advanced Analytics**: Funnels, cohorts, feature flags
- ✅ **User Identification**: Can identify users when they sign in

## 📊 **What's Tracked**

### **Vercel Analytics (Automatic)**

- Page views for all routes
- Performance metrics
- Core Web Vitals
- Real-time visitor data

### **PostHog (Custom Events)**

#### **Core Drill Events**

- ✅ **Drill Views**: Every drill page visit with metadata
- ✅ **Drill Creation**: New drill creation with content details
- ✅ **Drill Editing**: Drill modifications
- ✅ **Drill Deletion**: Drill removal tracking
- ✅ **Drill Ratings**: User ratings of drills in sessions

#### **Session Management**

- ✅ **Session Creation**: Logging training sessions with drills
- ✅ **Practice Sessions**: Logging sessions without drills (matches, solo practice)
- ✅ **Session Deletion**: Removing sessions
- ✅ **Session Duration**: Tracking session length and notes

#### **AI-Powered Features**

- ✅ **AI Recommendation Selected**: When users select recommended drills
- ✅ **Session from AI**: Creating sessions from AI recommendations
- ✅ **AI Cache Performance**: Cache hits/misses for optimization
- ✅ **AI Errors**: Tracking AI service issues

#### **User Engagement**

- ✅ **User Sign-ins**: Authentication events
- ✅ **Search Queries**: What users search for
- ✅ **Random Drill Selection**: Random feature usage
- ✅ **Timer Usage**: Start/completion tracking
- ✅ **Video Play**: YouTube video engagement (when available)

## 🔧 **Technical Implementation**

### **Files Structure**

```
src/
├── lib/
│   ├── analytics.ts      # PostHog custom event functions
│   ├── ai.ts            # AI service with tracking
│   └── posthog.ts        # PostHog configuration
├── components/
│   ├── PostHogProvider.tsx  # PostHog initialization
│   ├── CreateSessionForm.tsx # Session tracking
│   ├── SessionCard.tsx      # Session deletion tracking
│   ├── PlanNextSession.tsx  # AI recommendations tracking
│   └── YouTubeVideo.tsx     # Video tracking (removed)
└── app/
    └── layout.tsx        # Both analytics providers
```

### **Configuration**

#### **Environment Variables**

```env
# PostHog Configuration
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com  # Optional, defaults to PostHog Cloud

# AI Configuration (for AI tracking)
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-4o-mini
SITE_URL=https://yourdomain.com
```

#### **Vercel Analytics**

- Automatically configured when deployed to Vercel
- No additional setup required

## 📈 **Analytics Dashboards**

### **Vercel Analytics Dashboard**

1. Go to your Vercel project dashboard
2. Click "Analytics" tab
3. View page views, performance metrics, and real-time data

### **PostHog Dashboard**

1. Go to [app.posthog.com](https://app.posthog.com)
2. Navigate to your project
3. View custom events, funnels, and user behavior

## 🎯 **Event Tracking Examples**

### **Session Creation Event**

```typescript
posthog.capture("session_created", {
  session_name: "Morning Training",
  has_drills: true,
  drill_count: 3,
  has_notes: true,
  duration_minutes: 45,
});
```

### **AI Recommendation Event**

```typescript
posthog.capture("ai_recommendation_selected", {
  drill_name: "Backhand Loop",
  drill_slug: "backhand-loop",
  priority: "high",
  reason: "Targets your weak backhand mentioned in recent practice",
});
```

**Note**: We removed `ai_recommendations_viewed` as it doesn't provide meaningful insights - users might scroll past without engaging. We focus on tracking actual interactions instead.

### **Practice Session Event**

```typescript
posthog.capture("practice_session_logged", {
  session_name: "Match vs John",
  has_notes: true,
  duration_minutes: 60,
});
```

### **Drill Rating Event**

```typescript
posthog.capture("drill_rated", {
  drill_name: "Forehand Counter",
  drill_slug: "forehand-counter",
  rating: 4,
  session_name: "Afternoon Practice",
});
```

## 🔒 **Privacy & Compliance**

### **Data Collected**

- **Vercel**: Page views, performance metrics (anonymous)
- **PostHog**: User interactions, drill metadata, session data (anonymous)
- **No Personal Data**: No email addresses or personal info tracked
- **Session Data**: Only session names and drill metadata, no personal notes

### **GDPR Compliance**

- Both platforms support GDPR compliance
- Anonymous tracking by default
- Users can opt-out via browser settings

## 🚀 **Setup Instructions**

### **1. PostHog Setup (Optional)**

- **Development**: No setup required - events logged to console
- **Production**: Optional - add API key to environment variables:
  ```env
  NEXT_PUBLIC_POSTHOG_KEY=your_api_key_here
  ```

### **2. Vercel Analytics**

- Automatically enabled when deployed to Vercel
- No additional configuration needed

### **3. Local Development**

- PostHog events logged to console (no API key needed)
- Vercel Analytics works in development
- Safe for testing without mixing with production data

## 📊 **Key Metrics Available**

### **Vercel Analytics**

- Page views per route
- Performance metrics
- Real-time visitor count
- Geographic distribution

### **PostHog Analytics**

#### **Session Analytics**

- Session creation patterns
- Practice vs drill session ratios
- Session duration trends
- Most popular drill combinations

#### **AI Feature Analytics**

- AI recommendation selection rates
- Session creation from AI recommendations
- AI cache performance
- AI service reliability

#### **User Behavior**

- Custom event counts
- User behavior funnels
- Feature usage patterns
- Drill popularity rankings
- Search term analysis
- Timer usage statistics

## 🎉 **Benefits of Hybrid Approach**

### **Cost Efficiency**

- Vercel Analytics: Free with Vercel hosting
- PostHog: 1M events/month free tier
- No additional costs for basic analytics

### **Feature Completeness**

- Vercel: Excellent page view and performance tracking
- PostHog: Advanced custom event analytics
- Best of both platforms

### **Reliability**

- Redundant tracking ensures no data loss
- Platform-specific optimizations
- Industry-standard analytics

## 🔮 **Future Enhancements**

### **User Identification**

```typescript
// When user signs in
posthog.identify(userId, {
  email: user.email,
  name: user.name,
});
```

### **Feature Flags**

```typescript
// A/B testing capabilities
const featureEnabled = posthog.isFeatureEnabled("new-feature");
```

### **Advanced Analytics**

- Funnel analysis for user journeys
- Cohort analysis for user retention
- A/B testing for feature optimization

## 📋 **Event Schema Reference**

### **Core Drill Events**

| Event           | Properties                                             | Description        |
| --------------- | ------------------------------------------------------ | ------------------ |
| `drill_view`    | `drill_name`, `drill_slug`, `difficulty`, `categories` | Drill page visit   |
| `drill_created` | `drill_name`, `difficulty`, `categories`, `has_video`  | New drill creation |
| `drill_edited`  | `drill_name`, `drill_slug`                             | Drill modification |
| `drill_deleted` | `drill_name`, `drill_slug`                             | Drill deletion     |
| `drill_rated`   | `drill_name`, `drill_slug`, `rating`, `session_name`   | Drill rating       |

### **Session Management Events**

| Event                     | Properties                                                                   | Description      |
| ------------------------- | ---------------------------------------------------------------------------- | ---------------- |
| `session_created`         | `session_name`, `has_drills`, `drill_count`, `has_notes`, `duration_minutes` | Session creation |
| `practice_session_logged` | `session_name`, `has_notes`, `duration_minutes`                              | Practice session |
| `session_deleted`         | `session_name`, `session_id`, `drill_count`                                  | Session deletion |

### **AI-Powered Events**

| Event                        | Properties                                       | Description       |
| ---------------------------- | ------------------------------------------------ | ----------------- |
| `ai_recommendation_selected` | `drill_name`, `drill_slug`, `priority`, `reason` | AI drill selected |
| `session_from_ai`            | `drill_count`, `selected_drills`                 | Session from AI   |
| `ai_cache_hit`               | `cache_type`                                     | AI cache hit      |
| `ai_cache_miss`              | `cache_type`                                     | AI cache miss     |
| `ai_error`                   | `error_type`, `error_message`                    | AI service error  |

### **User Engagement Events**

| Event                   | Properties                              | Description                 |
| ----------------------- | --------------------------------------- | --------------------------- |
| `user_signed_in`        | `method`                                | Authentication              |
| `search_performed`      | `query`, `results_count`                | Search query                |
| `random_drill_selected` | `drill_name`, `drill_slug`              | Random drill usage          |
| `timer_started`         | `duration_seconds`                      | Timer start                 |
| `timer_completed`       | `duration_seconds`                      | Timer completion            |
| `video_played`          | `drill_name`, `drill_slug`, `video_url` | Video play (when available) |

## 🎯 **Business Insights**

### **Content Strategy**

- Identify most popular drills
- Understand search patterns
- Optimize content based on engagement
- Track AI recommendation effectiveness

### **User Experience**

- Track feature adoption
- Identify user pain points
- Optimize user journeys
- Monitor session patterns

### **Product Development**

- Data-driven feature decisions
- User behavior insights
- Growth strategy validation
- AI feature performance

### **Training Insights**

- Most effective drill combinations
- Session duration patterns
- Practice vs drill session preferences
- Rating patterns for drill effectiveness

---

**Analytics are now live with comprehensive tracking!** 🚀

- **Vercel Analytics**: Automatic page view tracking
- **PostHog**: Custom event tracking with advanced analytics
- **Session Tracking**: Complete session management analytics
- **AI Analytics**: AI recommendation and performance tracking
- **Free Tier**: 1M events/month on PostHog
- **Real-time**: Both dashboards provide live data
