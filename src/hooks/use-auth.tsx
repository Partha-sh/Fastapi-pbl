import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useQuery } from "@tanstack/react-query";

import { queryClient } from "@/api/query-client";
import { getSessionUser } from "@/services/auth.service";
import type { SessionUser } from "@/types/auth";
import { getStoredToken, removeStoredToken, setStoredToken } from "@/utils/storage";

type AuthContextValue = {
  token: string | null;
  user: SessionUser | null;
  hasToken: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (token: string) => void;
  logout: () => void;
  refreshSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const sessionQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getSessionUser,
    enabled: Boolean(token),
    retry: false,
  });

  const logout = () => {
    removeStoredToken();
    setToken(null);
    queryClient.clear();
  };

  const login = (nextToken: string) => {
    setStoredToken(nextToken);
    setToken(nextToken);
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  };

  const refreshSession = () => {
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  };

  useEffect(() => {
    const handleAuthExpired = () => {
      logout();

      if (!window.location.pathname.startsWith("/login")) {
        window.location.replace("/login");
      }
    };

    window.addEventListener("pixshare:auth-expired", handleAuthExpired);
    return () => {
      window.removeEventListener("pixshare:auth-expired", handleAuthExpired);
    };
  }, []);

  const value = useMemo(
    () => ({
      token,
      user: sessionQuery.data ?? null,
      hasToken: Boolean(token),
      isAuthenticated: Boolean(token && sessionQuery.data),
      isLoading: Boolean(token) && sessionQuery.isLoading,
      error: (sessionQuery.error as Error | null) ?? null,
      login,
      logout,
      refreshSession,
    }),
    [sessionQuery.data, sessionQuery.error, sessionQuery.isLoading, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
