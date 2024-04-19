/* eslint-disable react-refresh/only-export-components */
import { Spinner } from '@/components/icons/spinner';
import { useAuthLoader } from '@/lib/auth';
import { lazyNamedImport } from '@/lib/utils';
import { PropsWithChildren, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const fallback = (
  <div className="h-screen w-full flex items-center justify-center">
    <Spinner />
  </div>
);

const Public: React.FC<PropsWithChildren> = ({ children }) => {
  const { state } = useAuthLoader();

  if (state === 'loading') return fallback;
  if (state === 'authenticated') return <Navigate to="/" />;
  return <>{children}</>;
};

const App = () => {
  return (
    <Suspense fallback={fallback}>
      <Outlet />
    </Suspense>
  );
};


const { Auth } = lazyNamedImport(() => import('@/features/auth'), 'Auth');

export const publicRoutes = [
  {
    path: '/',
    element: (
      <Public>
        <App />
      </Public>
    ),
    children: [
      { path: '*', element: <Auth /> },
    ],
  },
];