import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthConfig } from "next-auth";
import { Provider } from "next-auth/providers/index";
import { User } from "@/types/user";
import { getClientIp } from "@/lib/ip";
import { getIsoTimestr } from "@/lib/time";
import { getUuid } from "@/lib/hash";
import { saveUser } from "@/services/user";
import { firebaseAdmin } from "@/lib/firebase-admin";
import { findUserByEmail } from "@/models/user";
import { verifyPassword } from "@/lib/password";

let providers: Provider[] = [];

// Email Password Credentials Auth
if (process.env.NEXT_PUBLIC_CREDENTIALS_EMAIL_PASSWORD_AUTH_ENABLED === "true") {
  providers.push(
    CredentialsProvider({
      id: "email-password",
      name: "Email Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Email Password provider - authorize called");
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Email Password provider - missing credentials");
          return null;
        }

        try {
          const { email, password } = credentials;
          
          // 查找用户
          const user = await findUserByEmail(email as string);
          if (!user) {
            console.log("Email Password provider - user not found");
            return null;
          }

          // 验证密码（使用 signin_openid 字段存储的密码哈希）
          if (!user.signin_openid) {
            console.log("Email Password provider - no password hash found");
            return null;
          }

          const isValidPassword = await verifyPassword(password as string, user.signin_openid);
          if (!isValidPassword) {
            console.log("Email Password provider - invalid password");
            return null;
          }

          console.log("Email Password provider - authentication successful");
          
          return {
            id: user.uuid,
            email: user.email,
            name: user.nickname || user.email.split('@')[0],
            image: user.avatar_url || null,
          };
        } catch (error) {
          console.error("Email Password Auth Error:", error);
          return null;
        }
      },
    })
  );
}

// Firebase Credentials Auth
providers.push(
  CredentialsProvider({
    id: "credentials",
    name: "credentials",
    credentials: {
      idToken: { type: "text" },
    },
    async authorize(credentials) {
      console.log("Credentials provider - authorize called with:", credentials);
      
      if (!credentials?.idToken) {
        console.log("Credentials provider - no idToken provided");
        return null;
      }

      try {
        console.log("Credentials provider - verifying idToken...");
        
        // 添加重试机制
        let retryCount = 0;
        const maxRetries = 3;
        let decodedToken;
        
        while (retryCount < maxRetries) {
          try {
            decodedToken = await firebaseAdmin
              .auth()
              .verifyIdToken(credentials.idToken as string);
            break; // 成功则跳出循环
          } catch (retryError: any) {
            retryCount++;
            console.log(`Firebase Auth verification attempt ${retryCount} failed:`, retryError.message);
            
            if (retryCount >= maxRetries) {
              throw retryError; // 达到最大重试次数，抛出错误
            }
            
            // 等待1秒后重试
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        if (!decodedToken) {
          console.log("Credentials provider - failed to verify token after retries");
          return null;
        }
        
        const { uid, email, name, picture } = decodedToken;

        console.log("Credentials provider - token verified:", { uid, email, name });

        if (!email) {
          console.log("Credentials provider - no email in token");
          return null;
        }

        const user = {
          id: uid,
          name: name || email.split('@')[0],
          email: email,
          image: picture,
        };

        console.log("Credentials provider - returning user:", user);
        return user;
      } catch (error) {
        console.error("Firebase Auth Error:", error);
        return null;
      }
    },
  })
);

// Google One Tap Auth
if (
  process.env.NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED === "true" &&
  process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID
) {
  providers.push(
    CredentialsProvider({
      id: "google-one-tap",
      name: "google-one-tap",

      credentials: {
        credential: { type: "text" },
      },

      async authorize(credentials, req) {
        const googleClientId = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID;
        if (!googleClientId) {
          console.log("invalid google auth config");
          return null;
        }

        const token = credentials!.credential;

        const response = await fetch(
          "https://oauth2.googleapis.com/tokeninfo?id_token=" + token
        );
        if (!response.ok) {
          console.log("Failed to verify token");
          return null;
        }

        const payload = await response.json();
        if (!payload) {
          console.log("invalid payload from token");
          return null;
        }

        const {
          email,
          sub,
          given_name,
          family_name,
          email_verified,
          picture: image,
        } = payload;
        if (!email) {
          console.log("invalid email in payload");
          return null;
        }

        const user = {
          id: sub,
          name: [given_name, family_name].join(" "),
          email,
          image,
          emailVerified: email_verified ? new Date() : null,
        };

        return user;
      },
    })
  );
}

// Google Auth
if (
  process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true" &&
  process.env.AUTH_GOOGLE_ID &&
  process.env.AUTH_GOOGLE_SECRET
) {
  providers.push(
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

// Github Auth
if (
  process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true" &&
  process.env.AUTH_GITHUB_ID &&
  process.env.AUTH_GITHUB_SECRET
) {
  providers.push(
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  );
}

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "google-one-tap");

export const authOptions: NextAuthConfig = {
  providers,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token, user }) {
      if (token && token.user && token.user) {
        session.user = token.user;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      try {
        // 只在首次登录时处理用户数据（user存在表示首次登录）
        if (user && user.email) {
          console.log("JWT callback - processing user:", { user, account });
          
          const dbUser: User = {
            uuid: getUuid(),
            email: user.email,
            nickname: user.name || "",
            avatar_url: user.image || "",
            signin_type: account?.provider === "credentials" ? "email" : (account?.type || "unknown"),
            signin_provider: account?.provider || "credentials",
            signin_openid: account?.provider === "credentials" ? user.id : (account?.providerAccountId || user.id),
            created_at: getIsoTimestr(),
            signin_ip: await getClientIp(),
          };

          try {
            const savedUser = await saveUser(dbUser);
            console.log("JWT callback - user saved:", savedUser);

            token.user = {
              uuid: savedUser.uuid,
              email: savedUser.email,
              nickname: savedUser.nickname,
              avatar_url: savedUser.avatar_url,
              created_at: savedUser.created_at,
            };
          } catch (e) {
            console.error("save user failed:", e);
          }
        }
        return token;
      } catch (e) {
        console.error("jwt callback error:", e);
        return token;
      }
    },
  },
};
