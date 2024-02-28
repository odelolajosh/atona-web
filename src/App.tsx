import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { Suspense } from 'react';
import { WsProvider } from './provider/WsProvider';

function App() {
  const fallback = (
    <div className="h-screen w-full flex items-center justify-center">
      Loading!!!
    </div>
  );

  return (
    <Suspense fallback={fallback}>
      <WsProvider>
        <RouterProvider router={router} />
      </WsProvider>
    </Suspense>
  )
}

export default App
