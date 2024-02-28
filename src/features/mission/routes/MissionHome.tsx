import { Map } from "@/components/map";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useWs } from "@/provider/WsProvider";
import { BoltSlashIcon } from "@heroicons/react/24/outline";
import { FlyMission } from "..";
import { useModal } from "@/lib/hooks/modal";
import { Position } from "@/components/map/types";

export const MissionHome = () => {
  const { status, lastMessage, connect, disconnect } = useWs("Home");
  const { openModal, modalProps, modal } = useModal<'fly'>();

  const initiateDroneConnection = () => {
    connect();
  }

  const cancelDroneConnection = () => {
    disconnect();
  }

  const restartDroneConnection = () => {
    connect();
  }

  return (
    <>
      <section className="flex w-full h-full relative">
        <aside className="w-full max-w-md">
          <section className="flex flex-col gap-4 items-center justify-center px-6 h-1/2 bg-muted/20">
            <p className={cn("mx-auto text-3xl font-medium text-center text-error capitalize", {
              "text-success": status === 'CONNECTED',
              "text-error": status === 'DISCONNECTED',
              "text-warning": status === 'CONNECTING'
            })}>{status.toLowerCase()}</p>
            {status === 'DISCONNECTED' ? (
              <div className="flex flex-col gap-4 items-center justify-center">
                <Button
                  type="button"
                  className="w-fit"
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
          <section className="bg-background text-white flex-1 h-1/2 overflow-auto snap-y snap-mandatory">
            <div className="h-full grid grid-cols-2 gap-y-4 snap-start">
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
                <span className="mx-auto text-xl">Status</span>
                <span className="mx-auto text-3xl text-white uppercase">{status === 'CONNECTED' ? (lastMessage?.status ?? "--") : "--"}</span>
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
                <span className="mx-auto text-xl">Mode</span>
                <span className="mx-auto text-3xl text-white">{status === 'CONNECTED' ? (lastMessage?.mode ?? "--") : "--"}</span>
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
                <span className="mx-auto text-xl">Groundspeed (m/s)</span>
                <span className="mx-auto text-3xl text-white">{status === 'CONNECTED' ? (lastMessage?.groundspeed ? Number(lastMessage?.groundspeed).toFixed(3) : "0.00") : "--"}</span>
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
                <span className="mx-auto text-xl">Altitude (m)</span>
                <span className="mx-auto text-3xl text-white">{status === 'CONNECTED' ? (lastMessage?.location[2] ? Number(lastMessage?.location[2]).toFixed(3) : "0.00") : "--"}</span>
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
                <span className="mx-auto text-xl flex gap-4"><span>Lat</span> <span>Long</span></span>
                <div className="flex flex-row gap-4 items-center justify-center">
                  <span className="mx-auto text-3xl text-white">{status === 'CONNECTED' ? (lastMessage?.location ? Number(lastMessage?.location[0]).toFixed(2) : "--") : "--"}</span>
                  <span className="mx-auto text-3xl text-white">{status === 'CONNECTED' ? (lastMessage?.location ? Number(lastMessage?.location[1]).toFixed(2) : "--") : "--"}</span>
                </div>
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
                <span className="mx-auto text-xl">Arm Status</span>
                <span className="mx-auto text-3xl text-white">{status === 'CONNECTED' ? (lastMessage?.armed ? Boolean(lastMessage?.armed) ? "Armed" : "Disarmed" : "--") : "--"}</span>
              </li>
            </div>

            <div className="h-full grid grid-cols-2 gap-y-4 snap-start">
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
                <span className="mx-auto text-xl">Battery</span>
                <span className="mx-auto text-3xl text-white">{status === 'CONNECTED' ? (lastMessage?.battery + '%' ?? "0%") : "--"}</span>
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
              </li>
            </div>

            <div className="h-full grid grid-cols-2 gap-y-4 snap-start">
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
                <span className="mx-auto text-xl">Yaw</span>
                <span className="mx-auto text-3xl text-white">{status === 'CONNECTED' ? (lastMessage?.attitude?.[2] ? Number(lastMessage?.attitude[2]).toFixed(2) + '°' : "0°") : "--"}</span>
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
                <span className="mx-auto text-xl">Pitch</span>
                <span className="mx-auto text-3xl text-white">{status === 'CONNECTED' ? (lastMessage?.attitude?.[1] ? Number(lastMessage?.attitude[1]).toFixed(2) + '°' : "0°") : "--"}</span>
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
                <span className="mx-auto text-xl">Roll</span>
                <span className="mx-auto text-3xl text-white">{status === 'CONNECTED' ? (lastMessage?.attitude?.[0] ? Number(lastMessage?.attitude[0]).toFixed(2) + '°' : "0°") : "--"}</span>
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
                <span className="mx-auto text-xl">Heading</span>
                <span className="mx-auto text-3xl text-white">{status === 'CONNECTED' ? (lastMessage?.heading ? Number(lastMessage?.heading).toFixed(2) + '°' : "0°") : "--"}</span>
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
              </li>
              <li className="flex flex-col gap-3 items-center justify-center text-muted-foreground">
              </li>
            </div>
          </section>
        </aside>
        <section className="grow h-full relative">
          <Map onFly={(wp) => openModal('fly', wp)} />
        </section>
      </section>
      <FlyMission {...modalProps('fly')} waypoints={(modal?.data ?? []) as Position[]} />
    </>
  )
}