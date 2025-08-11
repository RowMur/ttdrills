"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/Button";
import { Edit } from "lucide-react";
import Link from "next/link";

type Props = {
  drillSlug: string;
  creatorEmail: string;
};

export const EditDrillButton = ({ drillSlug, creatorEmail }: Props) => {
  const { data: session } = useSession();

  // Check if current user is the creator
  const isCreator = session?.user?.email === creatorEmail;

  if (!isCreator) {
    return null;
  }

  return (
    <Link href={`/drills/${drillSlug}/edit`}>
      <Button className="bg-primary text-white h-full hover:bg-primary-dark px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
        <Edit className="w-4 h-4" />
      </Button>
    </Link>
  );
};
