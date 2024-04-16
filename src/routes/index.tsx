import { createBrowserRouter } from "react-router-dom";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";



export const router = createBrowserRouter([
  ...protectedRoutes,
  ...publicRoutes
])