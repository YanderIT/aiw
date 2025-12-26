import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { oneTap } from "better-auth/plugins";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getSupabaseClient } from "@/models/db";
import { findUserByUuid } from "@/models/user";

// Create PostgreSQL connection pool for Better Auth
// You need to add DATABASE_URL to your .env file
// Get it from Supabase Dashboard > Settings > Database > Connection string (URI)
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  : undefined;

export const auth = betterAuth({
  database: pool!,

  // Base URL for auth callbacks
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_WEB_URL,
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,

  // Email and password authentication
  emailAndPassword: {
    enabled: process.env.NEXT_PUBLIC_CREDENTIALS_EMAIL_PASSWORD_AUTH_ENABLED === "true",
    minPasswordLength: 8,
    maxPasswordLength: 32,
    // Use existing bcrypt hashing to maintain compatibility
    password: {
      hash: async (password: string) => {
        return await hashPassword(password);
      },
      verify: async (data: { password: string; hash: string }) => {
        return await verifyPassword(data.password, data.hash);
      },
    },
  },

  // Social providers
  socialProviders: {
    // Google OAuth
    ...(process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true" &&
      process.env.AUTH_GOOGLE_ID &&
      process.env.AUTH_GOOGLE_SECRET
      ? {
          google: {
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          },
        }
      : {}),
    // GitHub OAuth
    ...(process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true" &&
      process.env.AUTH_GITHUB_ID &&
      process.env.AUTH_GITHUB_SECRET
      ? {
          github: {
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
          },
        }
      : {}),
  },

  // Plugins
  plugins: [
    // Google One Tap plugin
    ...(process.env.NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED === "true"
      ? [oneTap()]
      : []),
  ],

  // Map to existing users table
  user: {
    modelName: "users",
    fields: {
      id: "uuid",
      name: "nickname",
      image: "avatar_url",
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    additionalFields: {
      signin_type: {
        type: "string",
        required: false,
      },
      signin_provider: {
        type: "string",
        required: false,
      },
      signin_ip: {
        type: "string",
        required: false,
      },
      signin_openid: {
        type: "string",
        required: false,
      },
      invite_code: {
        type: "string",
        required: false,
      },
      invited_by: {
        type: "string",
        required: false,
      },
      locale: {
        type: "string",
        required: false,
      },
    },
  },

  // Session configuration
  session: {
    modelName: "session",
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  // Account configuration (for OAuth)
  account: {
    modelName: "account",
    fields: {
      userId: "user_id",
      providerId: "provider_id",
      accountId: "account_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  // Verification tokens
  verification: {
    modelName: "verification",
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
});

// Export type for session
export type Session = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;

// Custom session retrieval that works with our database structure
export async function getCustomSession(headers: Headers) {
  try {
    // Get session token from cookie
    const cookieHeader = headers.get("cookie");
    if (!cookieHeader) return null;

    // Parse cookies to find session token
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...val] = c.split("=");
        return [key, val.join("=")];
      })
    );

    const sessionToken = cookies["better-auth.session_token"];
    if (!sessionToken) return null;

    // Find session in database
    const supabase = getSupabaseClient();
    const { data: session, error: sessionError } = await supabase
      .from("session")
      .select("*")
      .eq("token", sessionToken)
      .single();

    if (sessionError || !session) return null;

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await supabase.from("session").delete().eq("id", session.id);
      return null;
    }

    // Get user by uuid (user_id in session table stores user's uuid)
    const user = await findUserByUuid(session.user_id);
    if (!user) return null;

    return {
      session: {
        id: session.id,
        userId: user.uuid,
        token: session.token,
        expiresAt: session.expires_at,
      },
      user: {
        id: user.uuid,
        uuid: user.uuid,
        email: user.email,
        name: user.nickname,
        nickname: user.nickname,
        image: user.avatar_url,
        avatar_url: user.avatar_url,
        emailVerified: user.email_verified,
      },
    };
  } catch (error) {
    console.error("Error getting custom session:", error);
    return null;
  }
}

// Wrapper that mimics Better Auth's auth.api.getSession interface
export const customAuth = {
  api: {
    getSession: async ({ headers }: { headers: Headers }) => {
      return getCustomSession(headers);
    },
  },
};
