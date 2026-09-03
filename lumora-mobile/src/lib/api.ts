// Thin fetch wrapper for the Laravel API (Sanctum Bearer-token auth, ADR-0005
// default conventions). Ported from lumora-academy's app/lib/api.ts — same
// request/error shape, different token storage (see below).
// No SWR/axios added — the app's fetch needs (a handful of GETs plus a few
// form POSTs) don't justify a new dependency.

import * as SecureStore from "expo-secure-store";
import { cacheGet, cacheSet } from "./offline-cache";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
// ponytail: `localhost` only resolves correctly from a web build or the iOS
// simulator. A physical device or an Android emulator needs a real LAN IP
// (or 10.0.2.2 for the Android emulator) — set EXPO_PUBLIC_API_BASE_URL for
// those. No platform-detection logic added here, just this known limitation.

const TOKEN_KEY = "lumora_token";

// ponytail: expo-secure-store (OS-level encryption) rather than AsyncStorage
// — matches the web app's stance that a Bearer token is a sensitive
// credential, not app-list convenience data (see lumora-academy's api.ts
// comment on this same tradeoff). Its API is async, unlike localStorage's
// sync reads, so every caller here awaits it — that's why this token-read
// path can't be a drop-in copy of the web hook.
export function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export function setToken(token: string): Promise<void> {
  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export function clearToken(): Promise<void> {
  return SecureStore.deleteItemAsync(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

type ApiFetchOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  { method = "GET", body, auth = true }: ApiFetchOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.message ?? `Request failed with status ${res.status}`,
      json?.errors,
    );
  }

  return json as T;
}

// Read-through cache for the curriculum screens ADR-0026 requires stay
// viewable offline (subjects/topics/lessons/assessments) — NOT used for
// mutations (progress/attempts/tutor) or anything else, since serving a
// stale response to a POST would be actively wrong, not a nicety.
// `stale: true` tells the caller the real request failed and this is a
// cached fallback, so the screen can show that honestly rather than
// silently pretending it's live data.
export async function apiFetchCached<T>(
  path: string,
  cacheKey: string,
): Promise<{ data: T; stale: boolean }> {
  try {
    const data = await apiFetch<T>(path, { auth: false });
    await cacheSet(cacheKey, data);
    return { data, stale: false };
  } catch (err) {
    const cached = await cacheGet<T>(cacheKey);
    if (cached !== null) return { data: cached, stale: true };
    throw err;
  }
}
