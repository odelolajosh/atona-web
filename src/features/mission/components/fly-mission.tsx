import { usePromise } from "@/lib/hooks/use-promise";
import { useForm } from "react-hook-form";
import { uploadMission } from "../api";
import { Position } from "@/components/map/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogProps } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useControllableState } from "@/lib/hooks/use-state";
import { Spinner } from "@/components/icons/spinner";

type MissionDTO = {
  altitude: number;
};

export const FlyMission = (props: DialogProps & { waypoints: Position[] }) => {
  const [open, onOpenChange] = useControllableState({
    prop: props.open,
    defaultProp: false,
    onChange: props.onOpenChange
  });

  const form = useForm<MissionDTO>({
    defaultValues: {
      altitude: 10,
    }
  });

  const {
    run: handleMission,
    status
  } = usePromise(async (data: MissionDTO) => {
    const altitude = Number(data.altitude);
    console.log("log", altitude, props.waypoints)
    await uploadMission(props.waypoints, altitude);
    // await takeoff(altitude);
    props.onOpenChange?.(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {props.children && <Dialog.Trigger asChild>{props.children}</Dialog.Trigger>}
      <Dialog.Content className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleMission)}>
            <Dialog.Header>
              <Dialog.Title>Create mission</Dialog.Title>
              <Dialog.Description>
                Set the takeoff altitude to fly drone.
              </Dialog.Description>
            </Dialog.Header>
            <div className="grid gap-4 py-4">
              <Form.Field
                control={form.control}
                name="altitude"
                render={({ field }) => (
                  <Form.Item className="grid grid-cols-4 items-center gap-4">
                    <Form.Label htmlFor="altitude" className="text-right">
                      Altitude
                    </Form.Label>
                    <Form.Control>
                      <Input id="altitude" type="number" {...field} className="col-span-3" />
                    </Form.Control>
                  </Form.Item>
                )}
              />
            </div>
            <Dialog.Footer>
              <Button type="submit" disabled={status === 'pending'}>
                Fly
                {status === 'pending' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Spinner className="w-6 h-6" />
                  </div>
                )}
              </Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
}