# Quick Analytics Setup Guide

## 🚀 **PostHog Setup (Optional)**

### **Development Mode (No Setup Required)**

- **No environment variables needed** - PostHog events will be logged to console in development
- **Safe for testing** - No events sent to PostHog servers
- **Easy debugging** - See all events in browser console

### **Production Setup (Optional)**

#### **1. Create PostHog Account**

1. Go to [posthog.com](https://posthog.com)
2. Sign up for a free account
3. Create a new project

#### **2. Get Your API Key**

1. In your PostHog project dashboard
2. Go to Project Settings → API Keys
3. Copy your "Project API Key"

#### **3. Add Environment Variable**

Create or update your `.env.local` file:

```env
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key_here
```

#### **4. Deploy**

- Deploy to Vercel to enable Vercel Analytics
- PostHog will start tracking immediately

## 📊 **What You'll Get**

### **Vercel Analytics Dashboard**

- Automatic page view tracking
- Performance metrics
- Real-time visitor data
- Available in your Vercel project dashboard

### **PostHog Dashboard**

- Custom event tracking (drill views, searches, etc.)
- User behavior analytics
- Advanced funnels and cohorts
- 1M events/month free tier

## 🎯 **Events Being Tracked**

- **Drill Views**: Every drill page visit
- **Drill Creation**: New drill creation
- **Search Queries**: What users search for
- **Timer Usage**: Start/completion tracking
- **Video Views**: YouTube video engagement
- **User Sign-ins**: Authentication events
- **Drill Edits/Deletions**: Content management

## ✅ **Verification**

### **Development Mode**

1. **Check Console**: Open browser console to see PostHog events logged
2. **Check Vercel**: Visit your Vercel project analytics tab
3. **Test Events**: Create a drill, search, use timer to see events in console

### **Production Mode**

1. **Check PostHog**: Visit your PostHog dashboard to see events
2. **Check Vercel**: Visit your Vercel project analytics tab
3. **Test Events**: Create a drill, search, use timer to see events

## 🔧 **How It Works**

- **No API Key**: Events logged to console in development, silently ignored in production
- **With API Key**: Events sent to PostHog for analytics
- **Vercel Analytics**: Always active for page views and performance metrics

That's it! Your analytics are now live and tracking. 🚀
