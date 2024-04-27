/* eslint-disable react-refresh/only-export-components */
import Wrapper from "@/components/wrapper";
import { useAuthLoader } from "@/lib/auth";
import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import missionRoutes from "@/features/mission/routes";
import chatRoutes from "@/features/chat/routes";
import vsRoutes from "@/features/vs/routes";
import { ErrorFallback, LoadingFallback } from "./views";

const Protected = ({ children }: { children: React.ReactNode }) => {
  const { pathname, search } = useLocation();
  const from = `${pathname}${search}`;

  const { state } = useAuthLoader();

  if (state === "loading") return <LoadingFallback />;
  if (state === "error") return <ErrorFallback />;
  if (state === "unauthenticated") return <Navigate to="/login" state={{ from }} />;
  return <>{children}</>;
};

const App = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Outlet />
    </Suspense>
  );
};

export const protectedRoutes = [
  {
    element: (
      <Protected>
        <Wrapper>
          <App />
        </Wrapper>
      </Protected>
    ),
    children: [
      { children: missionRoutes },
      { path: "chat", children: chatRoutes },
      { path: "vs", children: vsRoutes },
    ],
  },
];