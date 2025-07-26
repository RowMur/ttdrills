"use client";

import { Searchbox } from "@/components/Searchbox";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="flex max-w-3xl mx-auto justify-between items-center p-4 mb-8 bg-grey rounded-b-3xl text-white min-h-20">
      <h1 className="text-3xl font-bold text-center">
        <Link href="/" className="hover:underline">
          Table Tennis Drills
        </Link>
      </h1>
      {!isHome && <Searchbox />}
    </nav>
  );
};
