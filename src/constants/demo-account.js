/**
 * Demo member account — FRONTEND-ONLY validation.
 *
 * Same credentials as the website (phaserev/src/constants/test-auth.ts) so the
 * client can test both products with one login.
 *
 * ⚠️  Remove (or gate behind __DEV__) once a real auth API exists.
 *     See services/auth-service.js — it already switches to the API when
 *     EXPO_PUBLIC_API_URL is set.
 */
export const DEMO_CREDENTIALS = {
  email: "demo@phaserev.com",
  password: "demo1234",
};

/** @type {import("@/types/models").User} */
export const DEMO_USER = {
  id: "test-member-001",
  email: DEMO_CREDENTIALS.email,
  role: "member",
  displayName: "Alex Rivera",
  tierId: "performance",
};
