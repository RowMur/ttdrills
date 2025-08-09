import { Searchbox } from "@/components/Searchbox";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="max-w-4xl mx-auto mb-4 px-4 text-white">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 min-h-20 bg-grey rounded-b-3xl p-4">
        <div className="flex items-center gap-6">
          <h1 className="text-xl sm:text-2xl font-bold text-center">
            <Link href="/" className="hover:underline">
              Table Tennis Drills
            </Link>
          </h1>
          <Link
            href="/create"
            className="flex items-center gap-2 px-3 py-2 bg-green text-white rounded-lg hover:bg-green/80 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Drill
          </Link>
        </div>
        <Suspense fallback={<div>Loading Search...</div>}>
          <Searchbox />
        </Suspense>
      </div>
    </nav>
  );
};
