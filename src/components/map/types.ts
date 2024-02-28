export type Position = {
  lat: number;
  lng: number;
}

export type Waypoint = Position & {
  uid: string;
}

export type DomPosition = { x: number, y: number }