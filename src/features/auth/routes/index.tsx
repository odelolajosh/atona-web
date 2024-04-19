import { Outlet, Route, Routes } from 'react-router-dom';
import { Login } from './login';
import { Register } from './register';
import { MiniWrapper } from '@/components/wrapper';

const Wrapper = () => (
  <div className="relative flex items-center justify-center h-screen bg-muted-background bg-grid-white/[0.02]">
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    <MiniWrapper>
      <Outlet />
    </MiniWrapper>
  </div>
)

export const Auth = () => {
  return (
    <Routes>
      <Route element={<Wrapper />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  )
}