import { createBrowserRouter } from "react-router-dom";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";
import commonRoutes from "@/features/common/routes";

export const router = createBrowserRouter([
  ...protectedRoutes,
  ...publicRoutes,
  ...commonRoutes
])