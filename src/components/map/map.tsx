import { Tabs } from "@/components/ui/tab";
import { APIProvider, Map as GglMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { MapProps as GglMapProps, MapMouseEvent } from '@vis.gl/react-google-maps';
import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { useControllableState, useLocalState } from '@/lib/hooks/use-state';
import { Waypoints } from './waypoints';
import { Position, Waypoint } from './types';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { UAVIcon } from '../icons/uav';
import { useWs } from '@/providers/ws';
import { uuid } from '@/lib/utils';
import { useCurrentLocation } from './hooks';
import { MapMenu, NsMapContext, useNsMap } from "./provider";

const API_KEY = 'AIzaSyBSkctANDl9_ObFCJEc41oMwPYI2cPbXJo'

const mapTheme = {
  roadmap: {
    mapId: '739af084373f96fe',
    mapTypeId: 'terrain'
  },
  satellite: {
    mapId: '49ae42fed52588c3',
    mapTypeId: 'satellite'
  }
}

export type MapProps = PropsWithChildren<{
  waypoints?: Waypoint[];
  onWaypointsChange?: (waypoints: Position[]) => void;
  onFly?: (waypoints: Position[]) => void;
  theme?: keyof typeof mapTheme;
} & GglMapProps>;

const Map: React.FC<MapProps> = ({ children, waypoints, onWaypointsChange, onFly, ...props }) => {
  const { lastMessage, status } = useWs("Map");
  const [wps, setWps] = useControllableState<Waypoint[]>({
    prop: waypoints,
    onChange: onWaypointsChange,
    defaultProp: []
  });
  const currentPos = useCurrentLocation();
  const [menu, setMenu] = React.useState<MapMenu | null>(null);
  const [theme, setTheme] = useLocalState<keyof typeof mapTheme>('map-theme', 'roadmap');
  const [closePath, setClosePath] = useState(false);

  const dronePos = useMemo(() => {
    const location = lastMessage?.location;
    if (!location) return null;
    return { lat: location[0], lng: location[1] }
  }, [lastMessage]);

  const addWaypoint = useCallback((position: Position) => {
    setWps((wps) => {
      const newWp = { ...position, uid: `wp-${uuid()}` }
      return [...(wps || []), newWp]
    });
  }, [setWps]);

  const removeWaypoint = (wp: Waypoint) => {
    if (wps && wps.length < 4) setClosePath(false);
    setWps((wps) => wps?.filter((w) => w.uid !== wp.uid));
  }

  const contextMenu = useMemo(() => {
    return [
      {
        label: 'Add waypoint',
        onClick: (pos: Position) => {
          addWaypoint(pos);
        }
      },
      {
        label: closePath ? 'Open path' : 'Close path',
        onClick: () => {
          setClosePath((prev) => !prev);
        }
      },
      {
        label: 'Clear waypoints',
        onClick: () => {
          setWps([]);
          setClosePath(false);
        }
      },
      {
        label: 'Fly to waypoints',
        onClick: (pos: Position) => {
          pos;
          onFly?.(wps || []);
        },
        disabled: !wps?.length || status !== 'CONNECTED'
      },
      {
        label: 'Fly to here',
        onClick: (pos: Position) => {
          onFly?.([pos]);
        },
        disabled: status !== 'CONNECTED'
      },
    ]
  }, [closePath, wps, status, addWaypoint, setWps, onFly])

  const themeStyle = useMemo(() => {
    return mapTheme[theme]
  }, [theme])

  const handleContentMenu = (e: MapMouseEvent) => {
    if (!e.domEvent || !e.detail.latLng) return;
    const { x, y } = e.domEvent as MouseEvent;
    const { lat, lng } = e.detail.latLng
    setMenu({ type: "context_menu", dom: { x, y }, pos: { lat, lng } });
  }

  return (

    <NsMapContext currentPos={currentPos} waypoints={wps || []} addWaypoint={addWaypoint} removeWaypoint={removeWaypoint} menu={menu} setMenu={setMenu}>
      <APIProvider apiKey={API_KEY}>
        <DropdownMenu.Root open={menu?.type === "context_menu"} onOpenChange={(open) => !open && setMenu(null)}>
          <div className='w-full h-full relative'>
            <GglMap {...props} {...themeStyle} center={currentPos} zoom={19} gestureHandling='greedy' disableDefaultUI onContextmenu={handleContentMenu}>
              {children}
              {/* Current location marker */}
              <AdvancedMarker position={currentPos} title="Current location">
                <span className="flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-info opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-info shadow-xl"></span>
                </span>
              </AdvancedMarker>

              {/* Drone marker */}
              <AdvancedMarker position={dronePos} title="Drone">
                <UAVIcon className="text-background" size={48} />
              </AdvancedMarker>

              {/* Waypoints Marker */}
              <Waypoints waypoints={wps || []} onWaypointsChange={setWps} closePath={closePath} />
            </GglMap>
            <div className="absolute top-4 right-4 z-10">
              <Tabs
                defaultValue="roadmap"
                onValueChange={(value) => setTheme(value as keyof typeof mapTheme)}
              >
                <Tabs.List aria-label="Select a map type">
                  <Tabs.Trigger
                    value="roadmap"
                  >
                    Roadmap
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="satellite"
                  >
                    Satellite
                  </Tabs.Trigger>
                </Tabs.List>
              </Tabs>
            </div>
          </div>
          <ContextMenu options={contextMenu} />
        </DropdownMenu.Root>
      </APIProvider>
    </NsMapContext>
  )
}

type ContextMenuProps = {
  options: { label: string, onClick: (pos: Position) => void, disabled?: boolean }[];
}

const ContextMenu = ({ options }: ContextMenuProps) => {
  const { menu } = useNsMap("ContextMenu")
  if (menu?.type !== "context_menu") return null;

  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content className='fixed z-10 w-40 flex flex-col p-1 bg-background rounded-md shadow-md' style={{ top: menu.dom.y, left: menu.dom.x }} collisionPadding={8} alignOffset={4}>
        {options.map((item, i) => (
          <DropdownMenu.Item className="text-sm leading-none rounded-md flex items-center h-[28px] px-5 relative pl-5 select-none outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:bg-muted/50 data-[highlighted]:text-foreground" key={i} onSelect={() => item.onClick(menu.pos)} disabled={item.disabled}>
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  )
}

export { Map }