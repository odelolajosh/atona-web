import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

const rtcConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const uuid = "uuid"; // get uuid from server
const channel = {
  0: {
    on_demand: true,
    url: "https://www.youtube.com/watch?v=6JYIGclVQdw",
  }
}

export const VideoStream = () => {
  const player = useRef<HTMLVideoElement | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleTrack = useCallback(() => {
    (event: RTCTrackEvent) => {
      console.log("handleTrack: ", event.streams.length + " track is delivered");
      remoteStream.current?.addTrack(event.track);
    };
  }, []);

  const setRemoteDescription = useCallback(async () => {
    if (!peerConnection.current?.localDescription) return;

    const url = `/stream/${uuid}/channel/${channel}/webrtc?uuid=${uuid}&channel=${channel}`;

    try {
      const response = await axios.post(url, {
        data: btoa(peerConnection.current.localDescription.sdp)
      });
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: atob(response.data)
      }));
    } catch (error) {
      console.error("Error setting remote description:", error);
    }
  }, []);

  const processSignaling = useCallback(async (state: string) => {
    switch (state) {
      case "have-local-offer":
        await setRemoteDescription();
        break;
      case "stable":
        /*
         * There is no ongoing exchange of offer and answer underway.
         * This may mean that the RTCPeerConnection object is new, in which case both the localDescription and remoteDescription are null;
         * it may also mean that negotiation is complete and a connection has been established.
         */
        break;
      case "closed":
        /* The RTCPeerConnection has been closed. */
        break;
      default:
        console.log(`Unhandled signaling state: ${state}`);
    }
  }, [setRemoteDescription]);

  const setupPeerConnection = useCallback(async () => {
    if (!player.current) return;

    setIsConnecting(true);
    remoteStream.current = new MediaStream();
    player.current.srcObject = remoteStream.current;

    peerConnection.current = new RTCPeerConnection(rtcConfiguration);
    peerConnection.current.onnegotiationneeded = async () => await negotiateConnection();
    peerConnection.current.onsignalingstatechange = () => processSignaling(peerConnection.current?.signalingState || "");
    peerConnection.current.ontrack = handleTrack;
  }, [handleTrack, processSignaling]);

  const negotiateConnection = async () => {
    if (!peerConnection.current) return;

    const offer = await peerConnection.current.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await peerConnection.current.setLocalDescription(offer);
  };

  useEffect(() => {
    setupPeerConnection();
    return () => {
      remoteStream.current?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
      setIsConnecting(false);
    };
  }, [setupPeerConnection]);

  return (
    <div className="flex flex-col h-full w-full items-center justify-center p-4">
      <video
        ref={player}
        className={`bg-muted h-[600px] max-h-full w-full max-w-5xl rounded-lg ${isConnecting ? 'loading' : ''}`}
      />
      {isConnecting && <p>Connecting...</p>}
    </div>
  );
};
