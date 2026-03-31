"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export function useUserCredits() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    // DISABLED: Credits API call - commented out to prevent HTTP requests
    setCredits(0);
    setLoading(false);
    setError(null);
    return;

    /* ORIGINAL CODE - DISABLED
    if (!session) {
      setCredits(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/credits", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.code === 0) {
        setCredits(result.data.credits);
      } else {
        setError(result.message || "获取积分失败");
        setCredits(0);
      }
    } catch (error) {
      console.error("获取用户积分失败:", error);
      setError("网络错误");
      setCredits(0);
    } finally {
      setLoading(false);
    }
    */
  };

  useEffect(() => {
    fetchCredits();
  }, [session]);

  return {
    credits,
    loading,
    error,
    refetch: fetchCredits
  };
}