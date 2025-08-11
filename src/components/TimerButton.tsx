"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Timer } from "lucide-react";
import { SimpleTimer } from "@/components/SimpleTimer";

export const TimerButton = () => {
  const [showTimer, setShowTimer] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowTimer(true)}
        className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Timer className="w-4 h-4" />
        <span className="hidden md:inline">Timer</span>
      </Button>

      <Modal
        isOpen={showTimer}
        onClose={() => setShowTimer(false)}
        title="Timer"
        showCloseButton={true}
      >
        <SimpleTimer />
      </Modal>
    </>
  );
};
