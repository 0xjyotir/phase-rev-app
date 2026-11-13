/**
 * Auth service — sign in / sign out.
 *
 * Two modes, chosen automatically:
 *   1. API mode   (EXPO_PUBLIC_API_URL set) → POST /auth/login, returns { user, accessToken }
 *   2. Demo mode  (default)                 → validates the demo account locally
 *
 * Screens call `signIn()` / `signOut()` from hooks/useMember.js, which also
 * updates the session store and creates the member's profile.
 */
import { DEMO_CREDENTIALS, DEMO_USER } from "@/constants/demo-account";
import { ApiError, apiRequest, isApiConfigured } from "./api-client";

const DEMO_LATENCY_MS = 450; // makes the loading state visible, like a real request

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: import("@/types/models").User, accessToken: string | null }>}
 * @throws {Error} with a user-friendly message
 */
export async function signInWithEmail(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error("Enter your email and password.");
  }

  if (isApiConfigured()) {
    try {
      return await apiRequest("/auth/login", {
        method: "POST",
        auth: false,
        body: { email: normalizedEmail, password },
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        throw new Error("That email and password don't match.");
      }
      throw new Error("We couldn't reach Phase Rev. Check your connection and try again.");
    }
  }

  await wait(DEMO_LATENCY_MS);
  if (normalizedEmail === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    return { user: DEMO_USER, accessToken: null };
  }
  throw new Error("That email and password don't match. Try the demo account below.");
}

/** Tells the backend to invalidate the token (no-op in demo mode). */
export async function signOutRemote() {
  if (!isApiConfigured()) return;
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } catch {
    // Signing out locally must always succeed, even offline.
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
