# TTDrills - Table Tennis Training Journal

A comprehensive web application for tracking your table tennis training progress, logging sessions, and discovering drills to improve your game. The ultimate training journal for serious table tennis players.

## 🎯 Primary Features

### **Training Journal & Session Logging**

- **Session Logging**: Record training sessions with date, duration, and detailed notes
- **Drill Tracking**: Add specific drills to sessions with ratings and personal notes
- **Progress Analytics**: View training history, total practice time, and track improvement over time
- **Time Tracking**: Monitor time spent on different aspects of your game and specific drills
- **Training Notes**: Add personal notes to remember what worked and what needs improvement

### **Drill Library & Management**

- **Interactive Drill Diagrams**: Visual representation of ball sequences with step-by-step guidance
- **Video Demonstrations**: YouTube video integration with custom start times
- **Comprehensive Search**: Advanced search algorithm that understands table tennis terminology
- **Drill Creation**: Intuitive interface for building custom drills
- **Skill-Based Organization**: Drills organized by difficulty, technique, and category

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Google OAuth credentials

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/rowmur/ttdrills.git
cd table-tennis-drills
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Set up environment variables:**
   Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Optional: PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

4. **Set up the database:**
   Run the SQL migrations in your Supabase dashboard:

- `supabase/migrations/001_initial_schema.sql` - Initial schema
- `supabase/migrations/002_sessions.sql` - Sessions and training data
- `supabase/migrations/003_disable_sessions_rls.sql` - Disable RLS for sessions

5. **Run the development server:**

```bash
pnpm dev
```

6. **Open [http://localhost:3000](http://localhost:3000)** to see the application.

## 🗄️ Database Setup

### Setting up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Go to your project's SQL Editor
3. Run the migrations in order:
   - Copy and run `supabase/migrations/001_initial_schema.sql`
   - Copy and run `supabase/migrations/002_sessions.sql`
   - Copy and run `supabase/migrations/003_disable_sessions_rls.sql`
4. Get your project URL and anon key from Settings > API
5. Add them to your `.env.local` file

### Database Schema

The application uses the following main tables:

- **users**: User authentication and profile data
- **drills**: Comprehensive drill library with interactive diagrams
- **sessions**: Training session records
- **session_drills**: Individual drills within training sessions

## 🔐 Authentication Setup

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add `http://localhost:3000/api/auth/callback/google` to the authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env.local` file

## 📊 Key Features Explained

### Training Journal

- **Log Sessions**: Record when you practiced, for how long, and what you worked on
- **Track Drills**: Add specific drills to sessions with performance ratings
- **Monitor Progress**: View your training history and improvement over time
- **Personal Notes**: Add insights about what worked and what needs work

### Drill Library

- **Interactive Diagrams**: Visual ball sequences showing trajectory and timing
- **Video Integration**: YouTube videos with custom start times for demonstrations
- **Advanced Search**: Find drills by specific shots, techniques, or keywords
- **Custom Creation**: Build your own drills with the intuitive sequence builder

### Session Management

- **Sorting & Filtering**: Sort sessions by date, duration, or creation time
- **Pagination**: Navigate through your training history efficiently
- **Detailed Views**: See all drill details within each session
- **Progress Tracking**: Monitor your training consistency and improvement

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Type Checking
pnpm tsc          # Run TypeScript compiler
pnpm tsc --noEmit # Type check without emitting files

# Database
pnpm db:seed      # Seed the database with initial data
pnpm db:test      # Test database connection
```

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── create/         # Drill creation
│   ├── drills/         # Drill viewing and editing
│   ├── sessions/       # Training sessions
│   └── search/         # Drill search
├── components/         # React components
├── lib/               # Utility libraries
├── hooks/             # Custom React hooks
├── types.ts           # TypeScript type definitions
└── utils/             # Helper functions
```

### Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: NextAuth.js with Google OAuth
- **Analytics**: PostHog (optional)
- **Deployment**: Vercel

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to update these for production:

- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - A strong secret key
- Google OAuth redirect URIs - Add your production callback URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏓 About

TTDrills is built for table tennis players who want to track their training progress and discover new drills to improve their game. Whether you're a beginner learning basic strokes or an advanced player perfecting complex combinations, TTDrills helps you structure your training and monitor your improvement over time.
