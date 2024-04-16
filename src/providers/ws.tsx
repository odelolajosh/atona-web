/* eslint-disable react-refresh/only-export-components */
import { createContext } from "@/lib/context";
import SturdyWebSocket from "@/lib/ws";
import { PropsWithChildren, useCallback, useRef, useState } from "react";

type WsStatus = "CONNECTING" | "CONNECTED" | "DISCONNECTED";

type Telemetry = {
  velocity: number;
  lastHeartbeat: number;
  isArmable: boolean;
  groundspeed: number;
  mode: string;
  armed: boolean;
  location: [number, number, number];
  ekf_ok: boolean;
  status: string;
  battery: number;
  attitude: [number, number, number];
  heading: number;
}

type WsContextValueType = {
  status: WsStatus;
  connect: () => void;
  disconnect: () => void;
  messages: Telemetry[];
  lastMessage: Telemetry;
}

const [
  useWs,
  WsContextProvider,
] = createContext<WsContextValueType>("Ws", undefined);

const WsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const ws = useRef<SturdyWebSocket>();
  const [messages, setMessages] = useState<Telemetry[]>([]);
  const [status, setStatus] = useState<WsStatus>("DISCONNECTED");

  const reconnect = useCallback(() => {
    ws.current?.reconnect();
  }, []);

  const connect = useCallback(() => {
    if (ws.current) {
      reconnect();
      return;
    }
    setStatus("CONNECTING");
    ws.current = new SturdyWebSocket("ws://localhost:8000/ws/telemetry", {
      connectTimeout: 1000,
      debug: true,
      minReconnectDelay: 1000,
      maxReconnectDelay: 10000,
      maxReconnectAttempts: 5
    });
    ws.current.onopen = () => {
      console.log('WsProvider :: onopen')
      setStatus("CONNECTED");
    }
    ws.current.onreopen = () => {
      console.log('WsProvider :: onreopen')
      setStatus("CONNECTED");
    }
    ws.current.ondown = () => {
      console.log('WsProvider :: ondown')
      setStatus("DISCONNECTED");
    }
    ws.current.onmessage = (event) => {
      // console.log('WsProvider :: onmessage', event.data)
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    }
    ws.current.onclose = () => {
      console.log('WsProvider :: onclose')
      setStatus("DISCONNECTED");
      ws.current = undefined;
    }
    ws.current.onerror = () => {
      console.log('WsProvider :: onerror')
      setStatus("DISCONNECTED");
      ws.current = undefined;
    }
  }, [reconnect]);

  const disconnect = useCallback(() => {
    ws.current?.close();
    ws.current = undefined;
    setStatus("DISCONNECTED");
  }, []);

  return (
    <WsContextProvider status={status} connect={connect} disconnect={disconnect} messages={messages} lastMessage={messages[messages.length - 1]}>
      {children}
    </WsContextProvider>
  )
}

export { useWs, WsProvider };