"use client";

import { Searchbox } from "@/components/Searchbox";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="max-w-3xl mx-auto mb-4 px-4 text-white">
      <div className="flex justify-between items-center gap-4 min-h-20 bg-grey rounded-b-3xl p-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          <Link href="/" className="hover:underline">
            Table Tennis Drills
          </Link>
        </h1>
        {!isHome && <Searchbox />}
      </div>
    </nav>
  );
};
