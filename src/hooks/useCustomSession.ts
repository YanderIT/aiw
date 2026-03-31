"use client";

import { useState, useEffect, useCallback } from "react";

interface SessionUser {
  id: string;
  uuid: string;
  email: string;
  name: string;
  nickname: string;
  image: string;
  avatar_url: string;
  emailVerified: boolean;
}

interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
}

interface SessionData {
  session: Session;
  user: SessionUser;
}

interface UseCustomSessionReturn {
  data: SessionData | null;
  isPending: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCustomSession(): UseCustomSessionReturn {
  const [data, setData] = useState<SessionData | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      setIsPending(true);
      setError(null);

      const response = await fetch("/api/auth/get-session", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch session");
      }

      const sessionData = await response.json();

      // If session is null, user is not logged in
      if (!sessionData || !sessionData.user) {
        setData(null);
      } else {
        setData(sessionData);
      }
    } catch (err) {
      console.error("Error fetching session:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setData(null);
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    data,
    isPending,
    error,
    refetch: fetchSession,
  };
}
