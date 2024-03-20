import Wrapper from "@/components/Wrapper";
import { VideoStream } from "@/features/vs";
import { lazyNamedImport } from "@/lib/utils";
import { createBrowserRouter } from "react-router-dom";

const { MissionHome } = lazyNamedImport(() => import("@/features/mission"), "MissionHome");
const { Chat } = lazyNamedImport(() => import("@/features/chat"), "Chat");

export const router = createBrowserRouter([
  {
    element: <Wrapper />,
    children: [
      { path: "", element: <MissionHome /> },
      { path: "chat/*", element: <Chat /> },
      { path: "vs", element: <VideoStream /> }
    ]
  }
])