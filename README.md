# Table Tennis Drills

A web application for creating, sharing, and learning table tennis drills with interactive diagrams and video demonstrations.

## Features

- **Interactive Drill Diagrams**: Visual representation of ball sequences
- **Video Demonstrations**: YouTube video integration with custom start times
- **User Authentication**: Google OAuth sign-in for creating and managing drills
- **Drill Creation**: Intuitive interface for building custom drills
- **Search & Discovery**: Find drills by difficulty, category, and keywords
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd table-tennis-drills
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth Credentials
# Get these from https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

4. Set up the database:

```bash
# Run the SQL migration in your Supabase dashboard
# Copy the contents of supabase/migrations/001_initial_schema.sql
# and run it in the Supabase SQL editor
```

5. Run the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Setting up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Go to your project's SQL Editor
3. Copy and run the SQL from `supabase/migrations/001_initial_schema.sql`
4. Get your project URL and anon key from Settings > API
5. Add them to your `.env.local` file

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add `http://localhost:3000/api/auth/callback/google` to the authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env.local` file

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
