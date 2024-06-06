import { useWs } from "@/providers/ws";
import { useMemo } from "react";

interface TelemetryCellProps {
  label: string;
  value?: JSX.Element | string | number | null;
}

function TelemetryCell({ label, value }: TelemetryCellProps) {
  const { status } = useWs("TelemetryCell")
  return (
    <li className="flex flex-col gap-3 items-center justify-center p-3 text-muted-foreground">
      <span className="mx-auto text-lg">{label}</span>
      <span className="mx-auto text-2xl text-white">{status === 'CONNECTED' ? (value ?? "--") : "--"}</span>
    </li>
  )
}

interface TelemetryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cells: TelemetryCellProps[];
  title?: string;
}

function TelemetryGrid({ cells, title }: TelemetryGridProps) {
  return (
    <div className="snap-start relative">
      <h3 className="text-center text-sm sticky top-0 py-4">{title}</h3>
      <div className="h-full grid grid-cols-2 gap-y-4">
        {cells.map((cell, i) => (
          <TelemetryCell key={i} {...cell} />
        ))}
      </div>
    </div>
  )
}

function TelemetryGrids() {
  const { lastMessage: telemetry } = useWs("TelemetryGrids");
  const systemStatus = useMemo(() => [
    {
      label: "Status",
      value: telemetry?.status
    },
    {
      label: "Mode",
      value: telemetry?.mode
    },
    {
      label: "Arm Status",
      value: telemetry?.armed ? "Armed" : "Disarmed"
    },
    {
      label: "Battery",
      value: telemetry?.battery + '%'
    },
  ], [telemetry?.armed, telemetry?.battery, telemetry?.mode, telemetry?.status])

  const movementData = useMemo(() => [
    {
      label: "Groundspeed (m/s)",
      value: telemetry?.groundspeed
    },
    {
      label: "Altitude (m)",
      value: telemetry?.location[2]
    },
    {
      label: "Lat",
      value: telemetry?.location[0]
    },
    {
      label: "Long",
      value: telemetry?.location[1]
    },
    {
      label: "Arm Status",
      value: telemetry?.armed ? "Armed" : "Disarmed"
    },
    {
      label: "Yaw",
      value: telemetry?.attitude?.[2]
    },
    {
      label: "Pitch",
      value: telemetry?.attitude?.[1]
    },
    {
      label: "Roll",
      value: telemetry?.attitude?.[0]
    },
    {
      label: "Heading",
      value: telemetry?.heading
    }
  ], [telemetry?.armed, telemetry?.attitude, telemetry?.groundspeed, telemetry?.heading, telemetry?.location])

  return (
    <>
      <TelemetryGrid title="System" cells={systemStatus} />
      <TelemetryGrid title="Position & Movement" cells={movementData} />
    </>
  )
}

export { TelemetryGrids }