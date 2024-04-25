/* eslint-disable react-refresh/only-export-components */
import Wrapper from "@/components/wrapper";
import { Spinner } from "@/components/icons/spinner";
import { useAuthLoader } from "@/lib/auth";
import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import missionRoutes from "@/features/mission/routes";
import chatRoutes from "@/features/chat/routes";
import vsRoutes from "@/features/vs/routes";


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

const App = () => {
  return (
    <Suspense fallback={fallback}>
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
      ...missionRoutes,
      ...chatRoutes,
      ...vsRoutes
    ],
  },
];