"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, clearToken, getToken, setToken } from "./api";
import type { ApiResource, User } from "./types";

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Only stay in the loading state if there's a token to verify against /me.
  const [loading, setLoading] = useState(() => getToken() !== null);

  useEffect(() => {
    if (!getToken()) return;
    apiFetch<ApiResource<User>>("/api/v1/me")
      .then((res) => setUser(res.data))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch<ApiResource<User> & { token: string }>(
      "/api/v1/login",
      { method: "POST", body: { email, password }, auth: false },
    );
    setToken(res.token);
    setUser(res.data);
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      password_confirmation: string,
    ) => {
      const res = await apiFetch<ApiResource<User> & { token: string }>(
        "/api/v1/register",
        {
          method: "POST",
          body: { name, email, password, password_confirmation },
          auth: false,
        },
      );
      setToken(res.token);
      setUser(res.data);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/v1/logout", { method: "POST" });
    } catch {
      // Token may already be invalid/expired — clear local state regardless.
    }
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
