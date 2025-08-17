"use client";

import Link from "next/link";
import { LogoWithIcon } from "./LogoWithIcon";
import { Github } from "lucide-react";
import { useSession } from "next-auth/react";

export function Footer() {
  const { data: session } = useSession();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <LogoWithIcon />
            </div>
            <p className="text-text-subtle mb-4 max-w-md">
              Track your table tennis training progress, log sessions, and
              discover drills to improve your game. The ultimate training
              journal for serious players.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/rowmur/ttdrills"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sessions"
                  className="text-text-subtle hover:text-text transition-colors"
                >
                  Training Sessions
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-text-subtle hover:text-text transition-colors"
                >
                  Browse Drills
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="text-text-subtle hover:text-text transition-colors"
                >
                  Create Drill
                </Link>
              </li>
              {!session && (
                <li>
                  <Link
                    href="/auth/signin"
                    className="text-text-subtle hover:text-text transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-subtle text-sm">
            © {currentYear} TTDrills. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
