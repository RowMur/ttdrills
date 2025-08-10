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

- ✅ **Drill Views**: Every drill page visit with metadata
- ✅ **Drill Creation**: New drill creation with content details
- ✅ **Drill Editing**: Drill modifications
- ✅ **Drill Deletion**: Drill removal tracking
- ✅ **User Sign-ins**: Authentication events
- ✅ **Search Queries**: What users search for
- ✅ **Random Drill Selection**: Random feature usage
- ✅ **Timer Usage**: Start/completion tracking
- ✅ **Video Views**: YouTube video engagement

## 🔧 **Technical Implementation**

### **Files Structure**

```
src/
├── lib/
│   ├── analytics.ts      # PostHog custom event functions
│   └── posthog.ts        # PostHog configuration
├── components/
│   └── PostHogProvider.tsx  # PostHog initialization
└── app/
    └── layout.tsx        # Both analytics providers
```

### **Configuration**

#### **Environment Variables**

```env
# PostHog Configuration
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com  # Optional, defaults to PostHog Cloud
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

### **Drill View Event**

```typescript
posthog.capture("drill_view", {
  drill_name: "2 Backhands, 2 Forehands",
  drill_slug: "2-backhands-2-forehands",
  difficulty: "beginner",
  categories: "forehand,backhand,footwork",
});
```

### **Search Event**

```typescript
posthog.capture("search_performed", {
  query: "forehand",
  results_count: 12,
});
```

### **Timer Event**

```typescript
posthog.capture("timer_started", {
  duration_seconds: 120,
});
```

## 🔒 **Privacy & Compliance**

### **Data Collected**

- **Vercel**: Page views, performance metrics (anonymous)
- **PostHog**: User interactions, drill metadata (anonymous)
- **No Personal Data**: No email addresses or personal info tracked

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

### **Core Events**

| Event              | Properties                                             | Description        |
| ------------------ | ------------------------------------------------------ | ------------------ |
| `drill_view`       | `drill_name`, `drill_slug`, `difficulty`, `categories` | Drill page visit   |
| `drill_created`    | `drill_name`, `difficulty`, `categories`, `has_video`  | New drill creation |
| `search_performed` | `query`, `results_count`                               | Search query       |
| `timer_started`    | `duration_seconds`                                     | Timer start        |
| `timer_completed`  | `duration_seconds`                                     | Timer completion   |
| `video_viewed`     | `drill_name`, `drill_slug`, `video_url`                | Video view         |

### **User Events**

| Event                   | Properties                 | Description        |
| ----------------------- | -------------------------- | ------------------ |
| `user_signed_in`        | `method`                   | Authentication     |
| `drill_edited`          | `drill_name`, `drill_slug` | Drill modification |
| `drill_deleted`         | `drill_name`, `drill_slug` | Drill deletion     |
| `random_drill_selected` | `drill_name`, `drill_slug` | Random drill usage |

## 🎯 **Business Insights**

### **Content Strategy**

- Identify most popular drills
- Understand search patterns
- Optimize content based on engagement

### **User Experience**

- Track feature adoption
- Identify user pain points
- Optimize user journeys

### **Product Development**

- Data-driven feature decisions
- User behavior insights
- Growth strategy validation

---

**Analytics are now live with hybrid tracking!** 🚀

- **Vercel Analytics**: Automatic page view tracking
- **PostHog**: Custom event tracking with advanced analytics
- **Free Tier**: 1M events/month on PostHog
- **Real-time**: Both dashboards provide live data
