import axios from "axios";
import { useCallback, useEffect, useRef } from "react";

const rtcConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const VideoStream = () => {
  const player = useRef<HTMLVideoElement | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const init = useCallback(async () => {
    if (!player.current) return;

    remoteStream.current = new MediaStream();
    player.current.srcObject = remoteStream.current;
    
    peerConnection.current = new RTCPeerConnection(rtcConfiguration);
    peerConnection.current.onnegotiationneeded = handleNegotiationNeeded;
    peerConnection.current.onsignalingstatechange = signalingstatechange;

    peerConnection.current.ontrack = handleTrack;
    const offer = await peerConnection.current.createOffer({
      // iceRestart:true,
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await peerConnection.current.setLocalDescription(offer);
  }, []);

  const cleanup = useCallback(() => {
    remoteStream.current?.getTracks().forEach((track) => track.stop());
    peerConnection.current?.close();
  }, []);

  const handleTrack = (event: RTCTrackEvent) => {
    console.log("handleTrack: ", event.streams.length + " track is delivered");
    if (!remoteStream.current) return;
    remoteStream.current.addTrack(event.track);
  };

  const signalingstatechange = async () => {
    if (!peerConnection.current) return;
    let uuid, channel; // get uuid and channel from server
    const url = `/stream/${uuid}/channel/${channel}/webrtc?uuid=${uuid}&channel=${channel}`;

    switch (peerConnection.current.signalingState) {
      case "have-local-offer":
        if (!peerConnection.current.localDescription) return;
        try {
          const response = await axios.post(url, {
            data: btoa(peerConnection.current.localDescription.sdp)
          });
          const data = response.data;
          console.log(data);
          peerConnection.current.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp: atob(data)
          }));
        } catch (error) {
          console.error(error);
        }
        break;
      case "stable":
        /*
         * There is no ongoing exchange of offer and answer underway.
         * This may mean that the RTCPeerConnection object is new, in which case both the localDescription and remoteDescription are null;
         * it may also mean that negotiation is complete and a connection has been established.
         */
        break;

      case "closed":
        /*
         * The RTCPeerConnection has been closed.
         */
        break;

      default:
        console.log(
          `unhandled signalingState is ${peerConnection.current.signalingState}`,
        );
        break;
    }
  };

  async function handleNegotiationNeeded() {
    if (!peerConnection.current) return;
    let uuid, channel;
    const url = `/stream/${uuid}/channel/${channel}/webrtc?uuid=${uuid}&channel=${channel}`;
    const offer = await peerConnection.current.createOffer();

    await peerConnection.current.setLocalDescription(offer);
    if (!peerConnection.current.localDescription) return;
    try {
      const response = await axios.post(url, {
        data: btoa(peerConnection.current.localDescription.sdp)
      });
      const data = response.data;
      console.log(data);
      peerConnection.current.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: atob(data)
      }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    init();
    
    return () => {
      cleanup();
    }
  }, [cleanup, init]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <video
        ref={player}
        className="bg-secondary h-[600px] max-h-full w-full max-w-5xl rounded-lg"
      />
    </div>
  );
};
