"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Main } from "@/components/Main";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push("/");
      }
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Main>
      <div className="container max-w-md mx-auto">
        <div className="bg-surface border border-border rounded-lg p-8 mt-16">
          <h1 className="text-2xl font-bold text-center mb-6 text-text">
            Sign In to TTDrills
          </h1>

          <p className="text-text-muted text-center mb-8">
            Sign in to create and manage your own table tennis drills
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: "#000000" }}
          >
            {isLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <p className="text-xs text-text-muted text-center mt-6">
            By signing in, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </Main>
  );
}
