/* eslint-disable react-refresh/only-export-components */
import { Spinner } from '@/components/icons/Spinner';
import { AuthLoader } from '@/lib/auth';
import { lazyNamedImport } from '@/lib/utils';
import { PropsWithChildren, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const fallback = (
  <div className="h-screen w-full flex items-center justify-center">
    <Spinner />
  </div>
);

const Public: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthLoader
      renderLoading={() => fallback}
      renderUnauthenticated={() => <>{children}</>}
    >
      <Navigate to="/" />
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