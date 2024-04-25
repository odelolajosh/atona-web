import { RouteObject } from "react-router-dom";
import { AuthLayout } from "./layout";
import { Login } from "./login";
import { Register } from "./register";

const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
];

export default authRoutes;