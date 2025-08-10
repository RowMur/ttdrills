"use client";

import { Searchbox } from "@/components/Searchbox";
import Link from "next/link";
import { Suspense } from "react";
import { Plus, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/Button";

export const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="max-w-6xl mx-auto mb-4 px-4 text-text">
      <div className="flex flex-col gap-3 min-h-20 bg-surface rounded-b-3xl p-4 border border-border">
        {/* Top row - Title, Create button, Search, and Auth */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
              <Link
                href="/"
                className="hover:text-primary-light transition-colors"
              >
                <span className="hidden sm:inline">TTDrills</span>
                <span className="sm:hidden">TTDrills</span>
              </Link>
            </h1>
            {session && (
              <Link
                href="/create"
                className="flex items-center gap-1 px-2 py-2 bg-success text-white rounded-lg hover:bg-success-dark transition-colors text-xs font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden md:inline">Create Drill</span>
              </Link>
            )}
          </div>

          {/* Search - hidden on small screens */}
          <div className="hidden lg:block flex-1 max-w-md mx-4">
            <Suspense fallback={<div className="text-xs">Loading...</div>}>
              <Searchbox />
            </Suspense>
          </div>

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

        {/* Bottom row - Search (only on smaller screens) */}
        <div className="lg:hidden">
          <Suspense fallback={<div className="text-xs">Loading...</div>}>
            <Searchbox />
          </Suspense>
        </div>
      </div>
    </nav>
  );
};
