/* eslint-disable react-refresh/only-export-components */
import Wrapper from "@/components/wrapper";
import { Spinner } from "@/components/icons/spinner";
import { useAuthLoader } from "@/lib/auth";
import { lazyNamedImport } from "@/lib/utils";
import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const { Mission } = lazyNamedImport(() => import("@/features/mission"), "Mission");
const { MissionHome } = lazyNamedImport(() => import("@/features/mission"), "MissionHome");
const { Chat } = lazyNamedImport(() => import("@/features/chat"), "Chat");
const { VideoStream } = lazyNamedImport(() => import("@/features/vs"), "VideoStream");

const fallback = (
  <div className="h-screen w-full flex items-center justify-center">
    <Spinner />
  </div>
);

const Protected = ({ children }: { children: React.ReactNode }) => {
  const { pathname, search } = useLocation();
  const from = `${pathname}${search}`;

  const { state, error } = useAuthLoader();

  if (state === "loading") return fallback;
  if (state === "error") return <div>{error}</div>;
  if (state === "unauthenticated") return <Navigate to="/login" state={{ from }} />;
  return <>{children}</>;
};

Protected;

const Unprotected = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const App = () => {
  return (
    <Suspense fallback={fallback}>
      <Outlet />
    </Suspense>
  );
};

export const protectedRoutes = [
  {
    path: "/",
    element: (
      <Unprotected>
        <Wrapper>
          <App />
        </Wrapper>
      </Unprotected>
    ),
    children: [
      { path: "/", element: <MissionHome /> },
      { path: "mission/*", element: <Mission /> },
      { path: "chat/*", element: <Chat /> },
      { path: "vs/*", element: <VideoStream /> },
    ],
  },
];