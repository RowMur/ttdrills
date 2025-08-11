import { Main } from "@/components/Main";
import { Searchbox } from "@/components/Searchbox";
import { Button } from "@/components/Button";
import { Search, Play, BookOpen, Target, Users, Zap } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TTDrills - Table Tennis Drills with Interactive Diagrams",
  description:
    "Discover and practice table tennis drills with interactive diagrams, video demonstrations, and step-by-step instructions. Perfect for players of all levels.",
  keywords:
    "table tennis drills, ping pong training, table tennis practice, interactive drills, table tennis exercises",
  openGraph: {
    title: "TTDrills - Table Tennis Drills with Interactive Diagrams",
    description:
      "Discover and practice table tennis drills with interactive diagrams, video demonstrations, and step-by-step instructions.",
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
          Master Table Tennis with
          <span className="text-primary block">Interactive Drills</span>
        </h1>
        <p className="text-xl text-text-subtle mb-8 max-w-3xl mx-auto">
          Discover table tennis drills with step-by-step diagrams, video
          demonstrations, and detailed instructions. Perfect for players of all
          levels.
        </p>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-surface-light border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-text mb-4">
              Find Your Perfect Drill
            </h2>
            <Searchbox />
            <div className="mt-4 text-sm text-text-subtle">
              Try searching for:{" "}
              <strong className="text-text-muted">forehand</strong>,{" "}
              <strong className="text-text-muted">backhand</strong>,{" "}
              <strong className="text-text-muted">footwork</strong>,{" "}
              <strong className="text-text-muted">beginner</strong>,{" "}
              <strong className="text-text-muted">advanced</strong>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 w-fit mx-auto">
          <Link href="/search">
            <Button className="flex items-center gap-2 px-8 py-3 text-lg">
              <Search size={20} />
              Browse All Drills
            </Button>
          </Link>
          <Link href="/create">
            <Button className="flex items-center gap-2 px-8 py-3 text-lg border border-border bg-transparent text-text hover:bg-surface-light">
              <BookOpen size={20} />
              Create Your Own
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="text-primary" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">
            Interactive Diagrams
          </h3>
          <p className="text-text-subtle">
            Visualize every shot with our interactive diagrams that show ball
            trajectory, player movement, and timing.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="text-success" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">
            Skill-Based Training
          </h3>
          <p className="text-text-subtle">
            Drills organized by skill level, technique, and difficulty to help
            you progress systematically.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-warning/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-warning" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">
            For All Levels
          </h3>
          <p className="text-text-subtle">
            From beginners learning basic strokes to advanced players perfecting
            complex combinations.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-info/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-info" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">
            Detailed Instructions
          </h3>
          <p className="text-text-subtle">
            Step-by-step guidance with tips, common mistakes to avoid, and
            progression suggestions.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="text-secondary" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">
            Video Demonstrations
          </h3>
          <p className="text-text-subtle">
            Watch professional players demonstrate techniques with clear
            explanations and slow-motion analysis.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-primary" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">Smart Search</h3>
          <p className="text-text-subtle">
            Find exactly what you need with our intelligent search that
            understands table tennis terminology.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-surface-light border border-border rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-text mb-4">
          Ready to Improve Your Game?
        </h2>
        <p className="text-text-subtle mb-6 max-w-2xl mx-auto">
          Start improving your table tennis skills today. Begin with a simple
          search or explore our comprehensive drill library.
        </p>
        <Link href="/search">
          <Button className="px-8 py-3 text-lg">Start Practicing Now</Button>
        </Link>
      </div>
    </Main>
  );
}
