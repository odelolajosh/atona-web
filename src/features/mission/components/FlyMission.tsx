import { Button, Input } from "@/components/ui";
import { Modal, ModalProps } from "@/components/ui/Modal";
import { usePromise } from "@/lib/hooks/promise";
import { useForm } from "react-hook-form";
import { takeoff, uploadMission } from "../api";
import { Position } from "@/components/map/types";

export const FlyMission = (props: ModalProps & { waypoints: Position[] }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ altitude: string }>();

  const [handleMission, submitting] = usePromise(handleSubmit(async (data) => {
    const altitude = Number(data.altitude);
    console.log("handling mission", altitude, props.waypoints)
    await uploadMission(props.waypoints, altitude);
    await takeoff(altitude);
    props.onOpenChange?.(false);
  }));

  return (
    <Modal.Root {...props}>
      {props.children && <Modal.Trigger asChild>{props.children}</Modal.Trigger>}
      <Modal.Content title="Create Mission" description="Fly the drone to a location">
        <form onSubmit={handleMission}>
          <Input label="Altitude" type="number" defaultValue="10" error={errors.altitude?.message}
            {...register('altitude', { required: true })}
          />
          <div className="flex justify-end mt-6">
            <Button type="submit" size="sm" disabled={submitting}>
              Fly
            </Button>
          </div>
        </form>
      </Modal.Content>
    </Modal.Root>
  )
}