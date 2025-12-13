"use client";

import { createAuthClient } from "better-auth/react";
import { oneTapClient } from "better-auth/client/plugins";

// Create the auth client with plugins
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  plugins: [
    // Google One Tap plugin (only if enabled)
    ...(process.env.NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED === "true" &&
    process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID
      ? [
          oneTapClient({
            clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID,
            autoSelect: false,
            cancelOnTapOutside: false,
            context: "signin",
          }),
        ]
      : []),
  ],
});

// Export commonly used functions and hooks
export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient;

// Type exports
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
