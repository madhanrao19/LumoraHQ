// Ported from lumora-academy's app/lib/auth-context.tsx — same login/
// register/logout/me-on-mount logic. Only the token-existence check at
// startup differs, since expo-secure-store reads are async (see api.ts).

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
  // ponytail: web starts `loading` at `getToken() !== null` (a sync read).
  // expo-secure-store's getItemAsync is a Promise, so we can't know that up
  // front — always start loading and resolve it once the effect below runs.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken().then((token) => {
      if (!token) {
        setLoading(false);
        return;
      }
      apiFetch<ApiResource<User>>("/api/v1/me")
        .then((res) => setUser(res.data))
        .catch(() => clearToken())
        .finally(() => setLoading(false));
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch<ApiResource<User> & { token: string }>(
      "/api/v1/login",
      { method: "POST", body: { email, password }, auth: false },
    );
    await setToken(res.token);
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
      await setToken(res.token);
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
    await clearToken();
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
