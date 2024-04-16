/* eslint-disable react-refresh/only-export-components */
import Wrapper from "@/components/Wrapper";
import { Spinner } from "@/components/icons/Spinner";
import { AuthLoader } from "@/lib/auth";
import { lazyNamedImport } from "@/lib/utils";
import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

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

  return (
    <AuthLoader
      renderLoading={() => fallback}
      renderUnauthenticated={() => <Navigate to="/login" state={{ from }} />}
    >
      {children}
    </AuthLoader>
  );
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
    path: '/',
    element: (
      <Protected>
        <Wrapper>
          <App />
        </Wrapper>
      </Protected>
    ),
    children: [
      { path: '', element: <MissionHome /> },
      { path: "chat/*", element: <Chat /> },
      { path: "vs/*", element: <VideoStream /> }
    ],
  },
];