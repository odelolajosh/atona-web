import { RouteObject } from "react-router-dom";
import { Stray } from "./Stray";

const commonRoutes: RouteObject[] = [
  { path: '*', element: <Stray /> }
]

export default commonRoutes;