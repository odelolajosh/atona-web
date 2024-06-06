import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { useWs } from "@/providers/ws";
import { BoltSlashIcon } from "@heroicons/react/24/outline";
import { TelemetryGrids } from "./telemetry";
import { Drawer } from "@/components/ui/drawer";
import { useState } from "react";

const MapAside = () => {
  const { status, connect, disconnect } = useWs("Home");

  const [snap, setSnap] = useState<string | number | null>("300px");

  const initiateDroneConnection = () => {
    connect();
  }

  const cancelDroneConnection = () => {
    disconnect();
  }
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <aside className="w-full max-w-md">
        <section className="flex flex-col gap-4 items-center justify-center px-6 h-1/2 bg-muted/20">
          <p className={cn("mx-auto text-3xl font-medium text-center text-error capitalize", {
            "text-success": status === 'CONNECTED',
            "text-destructive": status === 'DISCONNECTED',
            "text-warning": status === 'CONNECTING'
          })}>{status.toLowerCase()}</p>
          {status === 'DISCONNECTED' ? (
            <div className="flex flex-col gap-4 items-center justify-center">
              <Button
                type="button"
                className="w-fit"
                size="lg"
                onClick={initiateDroneConnection}
              >
                Connect Drone
              </Button>
            </div>
          ) : status === 'CONNECTED' ? (
            <div className="flex gap-4 items-center justify-center">
              <Button onClick={cancelDroneConnection} className="gap-2">
                <BoltSlashIcon className='w-5 h-5 text-red-500' />
                <span>Disconnect</span>
              </Button>
              {/* <Button variant="ghost" onClick={restartDroneConnection} className="p-0 aspect-square">
                  <BoltSlashIcon className='w-5 h-5 text-red-500' />
                </Button> */}
            </div>
          ) : null}
        </section>
        <ScrollArea className="bg-background text-white h-1/2 snap-y snap-mandatory">
          <TelemetryGrids />
        </ScrollArea>
      </aside>
    )
  }

  return (
    <Drawer open snapPoints={["300px", 1]} activeSnapPoint={snap} setActiveSnapPoint={setSnap} dismissible={false} modal={false}>
      <Drawer.Content className="h-[calc(100dvh-4rem)]">
        <div className="mx-auto w-full max-w-sm">
          <Drawer.Header>
            <Drawer.Title>Your drone</Drawer.Title>
            {/* <Drawer.Description>Set your daily activity goal.</Drawer.Description> */}
          </Drawer.Header>
          <section className="flex flex-col gap-4 items-center justify-center px-6 h-[148px] bg-muted/20">
            <p className={cn("mx-auto text-3xl font-medium text-center text-error capitalize", {
              "text-success": status === 'CONNECTED',
              "text-destructive": status === 'DISCONNECTED',
              "text-warning": status === 'CONNECTING'
            })}>{status.toLowerCase()}</p>
            {status === 'DISCONNECTED' ? (
              <div className="flex flex-col gap-4 items-center justify-center">
                <Button
                  type="button"
                  className="w-fit"
                  size="lg"
                  onClick={initiateDroneConnection}
                >
                  Connect Drone
                </Button>
              </div>
            ) : status === 'CONNECTED' ? (
              <div className="flex gap-4 items-center justify-center">
                <Button onClick={cancelDroneConnection} className="gap-2">
                  <BoltSlashIcon className='w-5 h-5 text-red-500' />
                  <span>Disconnect</span>
                </Button>
                {/* <Button variant="ghost" onClick={restartDroneConnection} className="p-0 aspect-square">
                  <BoltSlashIcon className='w-5 h-5 text-red-500' />
                </Button> */}
              </div>
            ) : null}
          </section>
          <Drawer.Footer></Drawer.Footer>
        </div>
      </Drawer.Content>
    </Drawer>
  )
}

export { MapAside }