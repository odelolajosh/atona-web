import { RouteObject } from "react-router-dom";
import { Stray } from "./away";

const commonRoutes: RouteObject[] = [
  { path: '*', element: <Stray /> }
]

export default commonRoutes;