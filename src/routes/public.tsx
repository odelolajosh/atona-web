/* eslint-disable react-refresh/only-export-components */
import authRoutes from '@/features/auth/routes';
import { useAuthLoader } from '@/lib/auth';
import { PropsWithChildren, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { LoadingFallback } from './views';

const Public: React.FC<PropsWithChildren> = ({ children }) => {
  const { state } = useAuthLoader();

  if (state === 'loading') return <LoadingFallback />;
  if (state === 'authenticated') return <Navigate to="/" />;
  return <>{children}</>;
};

const App = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Outlet />
    </Suspense>
  );
};

export const publicRoutes = [
  {
    element: (
      <Public>
        <App />
      </Public>
    ),
    children: [
      ...authRoutes
    ],
  },
];