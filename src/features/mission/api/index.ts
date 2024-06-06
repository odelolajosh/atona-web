import { Position } from "@/components/map/types";
import { axios } from "@/lib/axios"


export const uploadMission = async (wps: Position[], altitude: number) => {
  const waypoints = wps.map((waypoint) => ([
    waypoint.lat,
    waypoint.lng,
    altitude,
  ]));
  const response = await axios.post('/mission', {
    waypoints,
    altitude,
    return_home: true,
    name: 'Mission',
  });
  return response.data;
}

export const takeoff = async (altitude: number) => {
  const response = await axios.post('/start_mission', { altitude });
  return response.data
}