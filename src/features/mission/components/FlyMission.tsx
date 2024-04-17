import { Modal, ModalProps } from "@/components/ui/modal";
import { usePromise } from "@/lib/hooks/promise";
import { useForm } from "react-hook-form";
import { takeoff, uploadMission } from "../api";
import { Position } from "@/components/map/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
          <label htmlFor="name" className="text-white">Username</label>
          <Input type="number" defaultValue="10"
            {...register('altitude', { required: true })}
          />
          {errors.altitude && <small>{errors.altitude?.message}</small>}
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