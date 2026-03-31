"use client";

import { authClient, useSession } from "@/lib/auth-client";
import { useEffect } from "react";

export default function useOneTapLogin() {
  const { data: session, isPending } = useSession();

  useEffect(() => {
    // Only trigger One Tap if not loading and not authenticated
    if (isPending) return;
    if (session) return;

    // Check if One Tap is enabled and client ID is available
    if (
      process.env.NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED !== "true" ||
      !process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID
    ) {
      return;
    }

    // Use Better Auth's One Tap client plugin
    const triggerOneTap = async () => {
      try {
        await authClient.oneTap({
          fetchOptions: {
            onSuccess: () => {
              // Reload to update session state
              window.location.reload();
            },
          },
        });
      } catch (error) {
        console.error("One Tap login error:", error);
      }
    };

    triggerOneTap();
  }, [session, isPending]);

  return null;
}
