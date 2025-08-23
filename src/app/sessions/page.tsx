"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Session, Drill } from "@/types";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { CreateSessionForm } from "@/components/CreateSessionForm";
import { SessionCard } from "@/components/SessionCard";
import { Pagination } from "@/components/Pagination";
import { Main } from "@/components/Main";
import { PlanNextSession } from "@/components/PlanNextSession";
import { DraftSessionManager } from "@/components/DraftSessionManager";
import Link from "next/link";

export default function SessionsPage() {
  const { status } = useSession();
  const draftManagerRef = useRef<{ refresh: () => void }>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [preSelectedDrills, setPreSelectedDrills] = useState<Drill[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [sortBy, setSortBy] = useState<
    "date" | "name" | "duration" | "created_at"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (status === "authenticated") {
      fetchSessions();
    }
  }, [status, currentPage, sortBy, sortOrder]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        sortBy: sortBy,
        sortOrder: sortOrder,
      });

      const response = await fetch(`/api/sessions?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);

        setTotalPages(data.pagination.totalPages);
        setTotalSessions(data.pagination.total);
      } else {
        console.error("Failed to fetch sessions");
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionCreated = () => {
    setShowCreateModal(false);
    setPreSelectedDrills([]);
    fetchSessions();
    // Refresh draft UI when a session is created
    draftManagerRef.current?.refresh();
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setPreSelectedDrills([]);
  };

  const handleCreateSessionWithDrills = (selectedDrills: Drill[]) => {
    setPreSelectedDrills(selectedDrills);
    setShowCreateModal(true);
  };

  const handleSessionDeleted = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    if (sessions.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (status === "loading") {
    return (
      <Main>
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-text">Loading...</div>
        </div>
      </Main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Main>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4 text-text">
            Sign in to view your sessions
          </h1>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Sign In
          </Link>
        </div>
      </Main>
    );
  }

  return (
    <Main>
      {/* Draft Session Manager - Prominent at top */}
      <DraftSessionManager
        ref={draftManagerRef}
        onDraftComplete={fetchSessions}
        onDraftDeleted={fetchSessions}
      />

      <div className="flex justify-between items-center mb-8 flex-wrap gap-y-2 gap-x-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Training Sessions</h1>
          <p className="text-text-muted mt-2">
            Track your table tennis practice sessions and progress
          </p>
        </div>
        <Button
          variant="success"
          onClick={() => setShowCreateModal(true)}
          className="text-nowrap grow sm:grow-0"
        >
          Log Session
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-lg text-text">Loading sessions...</div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-text-muted mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-text mb-2">
            No sessions yet
          </h3>
          <p className="text-text-muted mb-4">
            Start tracking your training by logging your first session.
          </p>
          <Button variant="success" onClick={() => setShowCreateModal(true)}>
            Log Your First Session
          </Button>
        </div>
      ) : (
        <>
          {/* Sessions Summary */}
          <div className="bg-surface rounded-lg border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-text mb-4">
              Sessions Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {totalSessions}
                </div>
                <div className="text-sm text-text-muted">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {sessions.reduce((total, session) => {
                    const sessionDuration =
                      session.durationMinutes ||
                      session.sessionDrills?.reduce(
                        (sum, sd) => sum + (sd.durationMinutes || 0),
                        0
                      ) ||
                      0;
                    return total + sessionDuration;
                  }, 0)}
                </div>
                <div className="text-sm text-text-muted">Total Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {sessions.reduce(
                    (total, session) =>
                      total + (session.sessionDrills?.length || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-text-muted">Total Drills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {(() => {
                    const allRatings = sessions.flatMap(
                      (session) =>
                        session.sessionDrills
                          ?.map((sd) => sd.rating)
                          .filter((r) => r !== undefined && r !== null) || []
                    );
                    if (allRatings.length === 0) return "N/A";
                    const avg =
                      allRatings.reduce((sum, rating) => sum + rating, 0) /
                      allRatings.length;
                    return Math.round(avg * 10) / 10;
                  })()}
                </div>
                <div className="text-sm text-text-muted">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* Plan Next Session */}
          <div className="mb-8">
            <PlanNextSession onCreateSession={handleCreateSessionWithDrills} />
          </div>

          {/* Sorting Controls */}
          {sessions.length > 0 && (
            <div className="flex justify-between items-center mb-6 flex-wrap gap-y-2 gap-x-8">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-text text-nowrap">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "date"
                        | "name"
                        | "duration"
                        | "created_at"
                    )
                  }
                  className="px-3 py-1 text-sm border border-border rounded bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="duration">Duration</option>
                  <option value="created_at">Created</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="p-1 text-text-muted hover:text-text transition-colors"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
              <div className="text-sm text-text-muted text-nowrap">
                {totalSessions} session{totalSessions !== 1 ? "s" : ""} total
              </div>
            </div>
          )}

          {/* Sessions List */}
          <div className="space-y-4" data-sessions-container>
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={handleSessionDeleted}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-between items-center">
              <div className="text-sm text-text-muted">
                Showing page {currentPage} of {totalPages}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title="Log Training Session"
      >
        <CreateSessionForm
          onSessionCreated={handleSessionCreated}
          preSelectedDrills={preSelectedDrills}
        />
      </Modal>
    </Main>
  );
}
