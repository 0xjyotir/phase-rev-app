/**
 * API client — the ONLY place that talks HTTP.
 *
 * The rule from the web repo (FRONTEND_BACKEND_INTEGRATION.md): UI code never
 * calls `fetch` directly; all requests go through `src/services/`.
 *
 * Configure the backend with an env var (Expo inlines EXPO_PUBLIC_* at build time):
 *   EXPO_PUBLIC_API_URL=https://api.phaserev.com/v1
 *
 * While the variable is empty the app runs in "demo mode" (see auth-service.js).
 */
import { useSessionStore } from "@/stores/session-store";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

export const isApiConfigured = () => API_URL.length > 0;

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/**
 * JSON request with the signed-in user's bearer token attached.
 *
 *   const profile = await apiRequest("/users/me/profile");
 *   await apiRequest("/users/me/mood", { method: "POST", body: { moodId, date } });
 */
export async function apiRequest(path, { method = "GET", body, headers = {}, auth = true } = {}) {
  if (!isApiConfigured()) {
    throw new ApiError("EXPO_PUBLIC_API_URL is not set — running in demo mode.", 0);
  }

  const token = useSessionStore.getState().accessToken;
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? `Request failed (${response.status})`,
      response.status,
      data,
    );
  }
  return data;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
