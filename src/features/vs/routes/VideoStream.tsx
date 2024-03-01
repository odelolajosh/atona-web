import { useRef } from "react";

export const VideoStream = () => {
  const player = useRef<HTMLVideoElement | null>(null);
  // const mediaStream = useRef<MediaStream | null>(null);
  // const webrtc = useRef<RTCPeerConnection | null>(null);

  // useEffect(() => {
  //   startPlay();
  //   return () => {
  //     mediaStream.current?.getTracks().forEach((track) => track.stop());
  //     webrtc.current?.close();
  //   };
  // }, []);

  // const startPlay = async () => {
  //   if (!player.current) return;
  //   mediaStream.current = new MediaStream();
  //   player.current.srcObject = mediaStream.current;

  //   const configuration = {
  //     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  //   };
  //   webrtc.current = new RTCPeerConnection(configuration);
  //   webrtc.current.onnegotiationneeded = handleNegotiationNeeded;
  //   webrtc.current.onsignalingstatechange = signalingstatechange;

  //   webrtc.current.ontrack = handleTrack;
  //   let offer = await webrtc.current.createOffer({
  //     //iceRestart:true,
  //     offerToReceiveAudio: true,
  //     offerToReceiveVideo: true,
  //   });
  //   await webrtc.current.setLocalDescription(offer);
  // };

  // const handleTrack = (event: RTCTrackEvent) => {
  //   console.log(event.streams.length + " track is delivered");
  //   mediaStream.current?.addTrack(event.track);
  // };

  // const signalingstatechange = async () => {
  //   if (!webrtc.current) return;
  //   switch (webrtc.current.signalingState) {
  //     case "have-local-offer":
  //       let uuid, channel;
  //       let url =
  //         "/stream/" +
  //         uuid +
  //         "/channel/" +
  //         channel +
  //         "/webrtc?uuid=" +
  //         uuid +
  //         "&channel=" +
  //         channel;
  //       // $.post(url, {
  //       //   data: btoa(webrtc.current.localDescription.sdp)
  //       // }, function (data) {
  //       //   try {
  //       //     console.log(data);
  //       //     webrtc.current.setRemoteDescription(new RTCSessionDescription({
  //       //       type: 'answer',
  //       //       sdp: atob(data)
  //       //     }))
  //       //   } catch (e) {
  //       //     console.warn(e);
  //       //   }

  //       // });
  //       break;
  //     case "stable":
  //       /*
  //        * There is no ongoing exchange of offer and answer underway.
  //        * This may mean that the RTCPeerConnection object is new, in which case both the localDescription and remoteDescription are null;
  //        * it may also mean that negotiation is complete and a connection has been established.
  //        */
  //       break;

  //     case "closed":
  //       /*
  //        * The RTCPeerConnection has been closed.
  //        */
  //       break;

  //     default:
  //       console.log(
  //         `unhandled signalingState is ${webrtc.current.signalingState}`,
  //       );
  //       break;
  //   }
  // };

  // async function handleNegotiationNeeded() {
  //   if (!webrtc.current) return;
  //   let uuid, channel;
  //   let url =
  //     "/stream/" +
  //     uuid +
  //     "/channel/" +
  //     channel +
  //     "/webrtc?uuid=" +
  //     uuid +
  //     "&channel=" +
  //     channel;
  //   let offer = await webrtc.current.createOffer();

  //   await webrtc.current.setLocalDescription(offer);
  //   // $.post(url, {
  //   //   data: btoa(webrtc.current.localDescription.sdp)
  //   // }, function (data) {
  //   //   try {
  //   //     console.log(data);
  //   //     webrtc.current.setRemoteDescription(new RTCSessionDescription({
  //   //       type: 'answer',
  //   //       sdp: atob(data)
  //   //     }))
  //   //   } catch (e) {
  //   //     console.warn(e);
  //   //   }

  //   // });
  // }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <video
        ref={player}
        className="bg-primary-700 h-[600px] max-h-full w-full max-w-5xl"
      />
    </div>
  );
};
