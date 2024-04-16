import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { Suspense } from 'react';
import { WsProvider } from './providers/ws';
import { AppProvider } from './providers/app';

function App() {
  const fallback = (
    <div className="h-screen w-full flex items-center justify-center">
      Loading!!!
    </div>
  );

  return (
    <Suspense fallback={fallback}>
      <AppProvider>
        <WsProvider>
          <RouterProvider router={router} />
        </WsProvider>
      </AppProvider>
    </Suspense>
  )
}

export default App
