"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { trackDrillDeletion } from "@/lib/analytics";
import { Trash2, AlertTriangle } from "lucide-react";

type Props = {
  drillSlug: string;
  drillName: string;
  creatorEmail: string;
};

export const DeleteDrillButton = ({
  drillSlug,
  drillName,
  creatorEmail,
}: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Check if current user is the creator
  const isCreator = session?.user?.email === creatorEmail;

  if (!isCreator) {
    return null;
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/drills/${drillSlug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete drill");
      }

      // Track drill deletion
      trackDrillDeletion(drillName, drillSlug);

      // Redirect to home page after successful deletion
      router.push("/");
    } catch (error) {
      console.error("Error deleting drill:", error);
      alert(
        `Error deleting drill: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowConfirmation(true)}
        className="bg-danger text-white hover:bg-danger-dark px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Delete Drill
      </Button>

      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Delete Drill"
        showCloseButton={!isDeleting}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-text-muted mb-6">
              Are you sure you want to delete &quot;{drillName}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-danger text-white hover:bg-danger-dark px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Drill"}
              </Button>
              <Button
                onClick={() => setShowConfirmation(false)}
                disabled={isDeleting}
                className="bg-surface text-text border border-border hover:bg-surface-light px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
