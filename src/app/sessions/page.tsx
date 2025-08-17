"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session } from "@/types";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { CreateSessionForm } from "@/components/CreateSessionForm";
import { SessionCard } from "@/components/SessionCard";
import { Pagination } from "@/components/Pagination";
import { Main } from "@/components/Main";
import Link from "next/link";

export default function SessionsPage() {
  const { data: session, status } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    if (status === "authenticated") {
      fetchSessions();
    }
  }, [status, currentPage]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/sessions?page=${currentPage}&limit=10`
      );
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
    fetchSessions();
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Training Sessions</h1>
          <p className="text-text-muted mt-2">
            Track your table tennis practice sessions and progress
          </p>
        </div>
        <Button variant="success" onClick={() => setShowCreateModal(true)}>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={handleSessionDeleted}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
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
        onClose={() => setShowCreateModal(false)}
        title="Log Training Session"
      >
        <CreateSessionForm onSessionCreated={handleSessionCreated} />
      </Modal>
    </Main>
  );
}
