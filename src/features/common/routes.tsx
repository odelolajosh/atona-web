import { RouteObject } from "react-router-dom";
import { Stray } from "./stray";

const commonRoutes: RouteObject[] = [
  { path: '*', element: <Stray /> }
]

export default commonRoutes;