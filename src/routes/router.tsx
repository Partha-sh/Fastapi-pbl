import type { ReactNode } from "react";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

import { ErrorState } from "@/components/common/error-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { AppLayout } from "@/layouts/app-layout";
import { AuthLayout } from "@/layouts/auth-layout";
import { useAuth } from "@/hooks/use-auth";

function FullScreenState({ children }: { children: ReactNode }) {
  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <div className="w-full max-w-lg">{children}</div>
    </div>
  );
}

function RootRedirect() {
  const { hasToken, isAuthenticated, isLoading } = useAuth();

  if (hasToken && isLoading) {
    return (
      <FullScreenState>
        <div className="surface flex items-center justify-center p-10">
          <LoadingSpinner label="Restoring your session" size="lg" />
        </div>
      </FullScreenState>
    );
  }

  return <Navigate replace to={isAuthenticated ? "/feed" : "/login"} />;
}

function PublicRoute() {
  const { hasToken, isAuthenticated, isLoading } = useAuth();

  if (hasToken && isLoading) {
    return (
      <FullScreenState>
        <div className="surface flex items-center justify-center p-10">
          <LoadingSpinner label="Checking session" size="lg" />
        </div>
      </FullScreenState>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/feed" />;
  }

  return <Outlet />;
}

function ProtectedRoute() {
  const { error, hasToken, isAuthenticated, isLoading, refreshSession } = useAuth();

  if (!hasToken) {
    return <Navigate replace to="/login" />;
  }

  if (isLoading) {
    return (
      <FullScreenState>
        <div className="surface flex items-center justify-center p-10">
          <LoadingSpinner label="Loading workspace" size="lg" />
        </div>
      </FullScreenState>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <FullScreenState>
        <ErrorState
          actionLabel="Retry"
          description="Your token exists locally, but the session could not be restored from the API."
          onAction={refreshSession}
          title="Session restore failed"
        />
      </FullScreenState>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            lazy: async () => {
              const module = await import("@/pages/Login");
              return { Component: module.default };
            },
          },
          {
            path: "/register",
            lazy: async () => {
              const module = await import("@/pages/Register");
              return { Component: module.default };
            },
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/feed",
            lazy: async () => {
              const module = await import("@/pages/Feed");
              return { Component: module.default };
            },
          },
          {
            path: "/create",
            lazy: async () => {
              const module = await import("@/pages/CreatePost");
              return { Component: module.default };
            },
          },
          {
            path: "/profile",
            lazy: async () => {
              const module = await import("@/pages/Profile");
              return { Component: module.default };
            },
          },
          {
            path: "/profile/edit",
            lazy: async () => {
              const module = await import("@/pages/EditProfile");
              return { Component: module.default };
            },
          },
          {
            path: "/profile/:username",
            lazy: async () => {
              const module = await import("@/pages/Profile");
              return { Component: module.default };
            },
          },
        ],
      },
    ],
  },
  {
    path: "*",
    lazy: async () => {
      const module = await import("@/pages/NotFound");
      return { Component: module.default };
    },
  },
]);
