import React from "react";
import { Position } from "./types";

export const useCurrentLocation = (onSuccess?: (position: Position) => void) => {
  const [pos, setPos] = React.useState<Position | null>(null);

  React.useEffect(() => {
    if (!navigator.geolocation) {
      setPos(null);
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      setPos(pos);
      onSuccess?.(pos);
    })
  }, [])

  return pos;
}