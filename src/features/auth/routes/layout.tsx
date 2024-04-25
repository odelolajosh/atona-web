import { Outlet } from 'react-router-dom';
import { MiniWrapper } from '@/components/wrapper';

const AuthLayout = () => (
  <div className="relative flex items-center justify-center h-screen bg-muted-background bg-grid-white/[0.01]">
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    <MiniWrapper>
      <div className="mt-[min(15%,10rem)] p-4">
        <Outlet />
      </div>
    </MiniWrapper>
  </div>
)

export { AuthLayout }