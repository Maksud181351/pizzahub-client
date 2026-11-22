import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { MongoClient, ObjectId } from "mongodb";
import dns from "node:dns";

// Local-only: use public DNS so mongodb+srv:// lookups work on networks that block SRV queries
if (process.env.NODE_ENV !== "production") dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Reuse one Mongo connection across hot reloads / serverless invocations
const client = (globalThis._pizzaMongo ??= new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"));
export const db = client.db(process.env.MONGODB_DB || "pizzahub");

const PUBLIC_ROLES = ["vendor", "customer"];

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL].filter(Boolean),
  database: mongodbAdapter(db),

  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  socialProviders: {
    google: { clientId: process.env.GOOGLE_CLIENT_ID || "", clientSecret: process.env.GOOGLE_CLIENT_SECRET || "" },
  },
  onAPIError: { errorURL: "/signin" },

  // "users" collection (matches the project spec)
  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true }, // only vendor/customer are accepted, see hooks below
      businessName: { type: "string", required: false, input: true },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
      onboarded: { type: "boolean", required: false, defaultValue: true, input: false },
    },
  },

  // Server-side password policy: 6+ chars, one uppercase, one lowercase
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const pw = ctx.body?.password || "";
        if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw)) {
          throw new APIError("BAD_REQUEST", { message: "Password needs at least one uppercase and one lowercase letter" });
        }
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        // Admin can NEVER be created through public registration.
        before: async (user, ctx) => {
          const viaEmailForm = ctx?.path === "/sign-up/email";
          const chosen = PUBLIC_ROLES.includes(user.role) ? user.role : "customer";
          return {
            data: {
              ...user,
              role: chosen,
              onboarded: viaEmailForm, // Google sign-ups pick their role once on /onboarding
              isBlocked: false,
              subscriptionPlan: "free",
              subscriptionExpiresAt: null,
            },
          };
        },
      },
      update: {
        // Profile updates can never touch role, block status or subscription fields
        before: async (data) => {
          // eslint-disable-next-line no-unused-vars
          const { role, isBlocked, subscriptionPlan, subscriptionExpiresAt, onboarded, ...safe } = data;
          return { data: safe };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const user = ObjectId.isValid(session.userId) ? await db.collection("users").findOne({ _id: new ObjectId(session.userId) }) : null;
          if (user?.isBlocked) throw new APIError("FORBIDDEN", { message: "Your account has been blocked. Contact PizzaHub support." });
        },
      },
    },
  },

  plugins: [
    // Issues short-lived JWTs (GET /api/auth/token) and publishes the public keys at /api/auth/jwks.
    // The Express API verifies every request against those keys.
    jwt({ jwt: { expirationTime: "15m", definePayload: ({ user }) => ({ id: user.id, email: user.email }) } }),
    nextCookies(), // keep last
  ],
});