import { Main } from "@/components/Main";
import { Searchbox } from "@/components/Searchbox";
import { Button } from "@/components/Button";
import {
  Search,
  Play,
  BookOpen,
  Target,
  Users,
  Zap,
  Calendar,
  BarChart3,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TTDrills - Track Your Table Tennis Training Progress",
  description:
    "Log your table tennis training sessions, track your progress, and discover drills to improve your game. The ultimate training journal for table tennis players.",
  keywords:
    "table tennis training journal, ping pong practice log, table tennis progress tracking, training sessions, table tennis drills",
  openGraph: {
    title: "TTDrills - Track Your Table Tennis Training Progress",
    description:
      "Log your table tennis training sessions, track your progress, and discover drills to improve your game.",
    type: "website",
    url: "https://ttdrills.com",
  },
};

export default function Home() {
  return (
    <Main>
      {/* Hero Section */}
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-text mb-6">
          Track Your Table Tennis
          <span className="text-primary block">Training Journey</span>
        </h1>
        <p className="text-xl text-text-subtle mb-8 max-w-3xl mx-auto">
          Log your training sessions, track your progress over time, and
          discover drills to improve your game. The ultimate training journal
          for serious table tennis players.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 w-fit mx-auto">
          <Link href="/sessions">
            <Button
              variant="primary"
              size="lg"
              className="flex items-center gap-2 px-8 py-3 text-lg"
            >
              <Calendar size={20} />
              Log Training Session
            </Button>
          </Link>
          <Link href="/search">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 px-8 py-3 text-lg"
            >
              <Search size={20} />
              Browse Drills
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section - Training Journal Focus */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        <div className="text-center p-6">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-primary" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">
            Session Logging
          </h3>
          <p className="text-text-subtle">
            Easily log your training sessions with date, duration, and detailed
            notes about your practice.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="text-success" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">
            Drill Tracking
          </h3>
          <p className="text-text-subtle">
            Record which drills you practiced, how long you spent on each, and
            rate your performance.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-warning/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="text-warning" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">
            Progress Analytics
          </h3>
          <p className="text-text-subtle">
            View your training history, total practice time, and track
            improvement over weeks and months.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-info/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-info" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">
            Drill Library
          </h3>
          <p className="text-text-subtle">
            Access hundreds of drills with interactive diagrams, video
            demonstrations, and detailed instructions.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-secondary" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">
            Time Tracking
          </h3>
          <p className="text-text-subtle">
            Monitor how much time you spend on different aspects of your game
            and specific drills.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-primary" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">
            Training Notes
          </h3>
          <p className="text-text-subtle">
            Add personal notes to each session and drill to remember what worked
            and what needs improvement.
          </p>
        </div>
      </div>

      {/* Final CTA - Back to Session Logging */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text mb-4">
          Ready to Start Tracking Your Progress?
        </h2>
        <p className="text-text-subtle mb-6 max-w-2xl mx-auto">
          Begin your table tennis training journal today. Log your first session
          and start building a comprehensive record of your improvement journey.
        </p>
        <Link href="/sessions">
          <Button variant="primary" size="lg" className="px-8 py-3 text-lg">
            Log Your First Session
          </Button>
        </Link>
      </div>
    </Main>
  );
}
