import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { oneTap } from "better-auth/plugins";
import { hashPassword, verifyPassword } from "@/lib/password";

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
      name: "nickname",
      image: "avatar_url",
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
