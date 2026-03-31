import { betterAuth } from "better-auth";
import { setDefaultResultOrder } from "dns";
import { Pool } from "pg";
import { oneTap } from "better-auth/plugins";
import { hashPassword, verifyPassword } from "@/lib/password";
import { initServerFetchProxy } from "@/lib/server-fetch-proxy";
import { getSupabaseClient } from "@/models/db";
import { findUserByUuid } from "@/models/user";

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  : undefined;

function getAuthBaseURL() {
  const rawBaseURL =
    process.env.AUTH_URL ||
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_WEB_URL ||
    "";

  if (!rawBaseURL) {
    return undefined;
  }

  const trimmedBaseURL = rawBaseURL.replace(/\/+$/, "");
  if (trimmedBaseURL.endsWith("/api/auth")) {
    return trimmedBaseURL;
  }

  return `${trimmedBaseURL}/api/auth`;
}

setDefaultResultOrder("ipv4first");
initServerFetchProxy();

const authBaseURL = getAuthBaseURL();

export const auth = betterAuth({
  database: pool!,
  baseURL: authBaseURL,
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,

  emailAndPassword: {
    enabled: process.env.NEXT_PUBLIC_CREDENTIALS_EMAIL_PASSWORD_AUTH_ENABLED === "true",
    minPasswordLength: 8,
    maxPasswordLength: 32,
    password: {
      hash: async (password: string) => {
        return await hashPassword(password);
      },
      verify: async (data: { password: string; hash: string }) => {
        return await verifyPassword(data.password, data.hash);
      },
    },
  },

  socialProviders: {
    ...((process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED !== "false") &&
      process.env.AUTH_GOOGLE_ID &&
      process.env.AUTH_GOOGLE_SECRET
      ? {
          google: {
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            redirectURI: authBaseURL
              ? `${authBaseURL}/callback/google`
              : undefined,
            prompt: "select_account",
          },
        }
      : {}),
    ...((process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED !== "false") &&
      process.env.AUTH_GITHUB_ID &&
      process.env.AUTH_GITHUB_SECRET
      ? {
          github: {
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
            redirectURI: authBaseURL
              ? `${authBaseURL}/callback/github`
              : undefined,
          },
        }
      : {}),
  },

  plugins: [
    ...(process.env.NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED === "true"
      ? [oneTap()]
      : []),
  ],

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
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  account: {
    storeStateStrategy: "cookie",
    modelName: "account",
    fields: {
      userId: "user_id",
      providerId: "provider_id",
      accountId: "account_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      scope: "scope",
      password: "password",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  verification: {
    modelName: "verification",
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;

export async function getCustomSession(headers: Headers) {
  try {
    const cookieHeader = headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...val] = c.split("=");
        return [key, val.join("=")];
      })
    );

    const sessionToken = cookies["better-auth.session_token"];
    if (!sessionToken) {
      console.log("[get-session] No session token in cookies");
      return null;
    }

    const supabase = getSupabaseClient();
    const { data: session, error: sessionError } = await supabase
      .from("session")
      .select("*")
      .eq("token", sessionToken)
      .single();

    if (sessionError || !session) {
      console.log("[get-session] Session not found in DB:", sessionError?.message);
      return null;
    }

    if (new Date(session.expires_at) < new Date()) {
      console.log("[get-session] Session expired:", session.expires_at);
      await supabase.from("session").delete().eq("id", session.id);
      return null;
    }

    const user = await findUserByUuid(session.user_id);
    if (!user) {
      console.log("[get-session] User not found for session user_id:", session.user_id);
      return null;
    }

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

export const customAuth = {
  api: {
    getSession: async ({ headers }: { headers: Headers }) => {
      return getCustomSession(headers);
    },
  },
};
