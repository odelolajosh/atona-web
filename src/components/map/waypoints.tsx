import { useControllableState } from "@/lib/hooks/use-state";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Waypoint } from "./types";
import { Polyline } from "./polyline";
import { PropsWithChildren, useMemo, useState } from "react";
import { LocationIcon } from "../icons/location";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useNsMap } from "./provider";

type WaypointsProps = {
  waypoints: Waypoint[];
  onWaypointsChange?: (waypoints: Waypoint[]) => void;
  closePath?: boolean;
}

export const Waypoints = (props: WaypointsProps) => {
  const [wps, setWps] = useControllableState({
    prop: props.waypoints,
    onChange: props.onWaypointsChange,
    defaultProp: []
  });
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const { setMenu } = useNsMap("Waypoints");

  // an array of array of two Position objects
  const paths = useMemo(() => {
    return wps?.map((p, i) => {
      if (i === wps?.length - 1 && props.closePath && wps?.length > 2) {
        return [p, wps[0]];
      }
      return [p, wps[i + 1]];
    }).filter((p) => p[1]);
  }, [wps, props.closePath]);

  const handleMarkerDragEnd = (e: any, index: number) => {
    if (!e.latLng) return;
    setWps((wp) => {
      const wps = [...(wp || [])]
      wps[index].lat = e.latLng.lat()
      wps[index].lng = e.latLng.lng()
      return wps
    })
  }

  const handleMarkerClick = (e: google.maps.MapMouseEvent, waypoint: Waypoint) => {
    // console.log("handleMarkerClick", e
    const domEvent = e.domEvent as MouseEvent;
    setMenu({ type: "waypoint_menu", dom: { x: domEvent.x, y: domEvent.y }, waypoint });
  }

  return (
    <>
      {/* Marker */}
      {wps?.map((wp, i) => (
        <AdvancedMarker key={wp.uid} position={wp} title={`${i + 1}`} draggable onDrag={(e) => handleMarkerDragEnd(e, i)} onDragEnd={(e) => handleMarkerDragEnd(e, i)} onClick={(e) => handleMarkerClick(e, wp)}>
          {/* <Pin background="red" glyphColor="white" /> */}
          <LocationIcon className="w-12 h-12 text-red-500" />
          <span className="absolute -bottom-1 text-xs font-semibold text-black">{`${i + 1}`}</span>
        </AdvancedMarker>
      ))}
      {/* Polyline */}
      {paths?.map((path, i) => (
        <Polyline key={i} path={path} strokeWeight={12} onClick={() => setSelectedPath(i)} strokeOpacity={selectedPath === i ? 1 : 0.5} />
      ))}
      <WaypointMenu />
    </>
  )
}

type WaypointMenuProps = DropdownMenu.DropdownMenuProps;

const WaypointMenu = ({ children, ...props }: PropsWithChildren<WaypointMenuProps>) => {
  const { menu, setMenu, removeWaypoint } = useNsMap("Waypoints");
  if (menu?.type !== 'waypoint_menu') return null;

  return (
    <DropdownMenu.Root {...props} open={menu?.type === "waypoint_menu"} onOpenChange={(open) => !open && setMenu(null)}>
      {children && <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>}
      <DropdownMenu.Content className='fixed z-10 w-48 p-1 bg-background rounded-md shadow-md' style={{ top: menu.dom.y, left: menu.dom.x }} collisionPadding={8} alignOffset={4}>
        <header>
          <h1 className='text-white text-center text-base font-medium my-2'>Edit Waypoint</h1>
        </header>
        <div className="flex flex-col">
          <DropdownMenu.Item className="text-sm leading-none rounded-md flex items-center h-[28px] px-5 relative pl-5 select-none outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:bg-muted/50 data-[highlighted]:text-foreground" onSelect={() => removeWaypoint(menu.waypoint)}>
            Remove Waypoint
          </DropdownMenu.Item>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}