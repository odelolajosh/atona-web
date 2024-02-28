import { Position } from "@/components/map/types";
import axios from "@/lib/axios"


export const uploadMission = (wps: Position[], altitude: number) => {
  const waypoints = wps.map((waypoint) => ([
    waypoint.lat,
    waypoint.lng,
    altitude,
  ]));
  const response = axios.post('/mission', {
    waypoints,
    altitude,
    return_home: true,
    name: 'Mission',
  });
  return response;
}

export const takeoff = (altitude: number) => {
  const response = axios.post('/start_mission', { altitude });
  return response;
}