"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Main } from "@/components/Main";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

export const AuthGuard = ({ children, fallback }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Main>
        <div className="container">
          <div className="text-center py-8">
            <div className="text-text-muted">Loading...</div>
          </div>
        </div>
      </Main>
    );
  }

  if (!session) {
    return (
      fallback || (
        <Main>
          <div className="container">
            <div className="text-center py-8">
              <div className="text-text-muted">
                Please sign in to access this page
              </div>
            </div>
          </div>
        </Main>
      )
    );
  }

  return <>{children}</>;
};
