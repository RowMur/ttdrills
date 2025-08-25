"use client";

import { Searchbox } from "@/components/Searchbox";
import { LogoWithIcon } from "@/components/LogoWithIcon";
import Link from "next/link";
import { Suspense, useState } from "react";
import { User, LogOut, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/Button";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top row - Logo, Navigation, and Auth */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <LogoWithIcon />
            </Link>

            {/* Navigation links - hidden on mobile */}
            <div className="hidden lg:flex items-center gap-6">
              <Link
                href="/search"
                className="text-text-muted hover:text-text transition-colors"
              >
                Browse Drills
              </Link>
              {session && (
                <Link
                  href="/sessions"
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Sessions
                </Link>
              )}
            </div>
          </div>

          {/* Right side - Search and Auth */}
          <div className="flex items-center gap-4">
            {/* Search - hidden on small screens */}
            <div className="hidden lg:block">
              <Suspense fallback={<div className="text-xs">Loading...</div>}>
                <Searchbox />
              </Suspense>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-text-muted hover:text-text transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Auth section */}
            {status === "loading" ? (
              <div className="text-text-muted text-xs">Loading...</div>
            ) : session ? (
              <div className="flex items-center gap-2">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 px-2 py-2 bg-surface-light text-text hover:bg-surface-dark transition-colors text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center gap-1 px-2 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-xs font-medium"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-surface">
            <div className="py-4 space-y-3">
              <Link
                href="/search"
                className="block px-4 py-2 text-text-muted hover:text-text hover:bg-surface-light transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Drills
              </Link>
              {session && (
                <Link
                  href="/sessions"
                  className="block px-4 py-2 text-text-muted hover:text-text hover:bg-surface-light transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sessions
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Bottom row - Search (only on smaller screens and not homepage) */}
        {!isHomePage && (
          <div className="lg:hidden pb-4">
            <Suspense fallback={<div className="text-xs">Loading...</div>}>
              <Searchbox />
            </Suspense>
          </div>
        )}
      </div>
    </nav>
  );
};
