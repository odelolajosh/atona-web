import { createContext } from "@/lib/context";
import { Position, Waypoint } from "./types";

export type MapMenu = {
  type: "context_menu";
  dom: { x: number, y: number };
  pos: Position;
} | {
  type: "waypoint_menu";
  dom: { x: number, y: number };
  waypoint: Waypoint;
}

type MapContextValue = {
  currentPos: Position | null;
  waypoints: Waypoint[];
  addWaypoint: (position: Position) => void;
  removeWaypoint: (waypoint: Waypoint) => void;

  menu: MapMenu | null;
  setMenu: (menu: MapMenu | null) => void;
}

export const [useNsMap, NsMapContext] = createContext<MapContextValue>('NsMapContext');