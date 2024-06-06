import { Map } from "@/components/map";
import { FlyMission } from "..";
import { useModal } from "@/lib/hooks/use-modal";
import { Position } from "@/components/map/types";
import { Helmet } from "react-helmet-async";
import { MapAside } from "../components/map-aside";

export const MissionHome = () => {
  const { openModal, modalProps, modal } = useModal<'fly'>();

  return (
    <>
      <Helmet>
        <title>Flight - Atona GCS</title>
      </Helmet>
      <section className="flex w-full h-full relative">
        <MapAside />
        <section className="grow h-full relative">
          <Map onFly={(wp) => openModal('fly', wp)} />
        </section>
      </section>
      <FlyMission {...modalProps('fly')} waypoints={(modal?.data ?? []) as Position[]} />
    </>
  )
}