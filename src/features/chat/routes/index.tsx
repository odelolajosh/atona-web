import { RouteObject } from "react-router-dom";
import { Lobby, Room } from "../components";
import { Chat } from "./chat";
import { ChatWrapper } from "./chat-wrapper";

const chatRoutes: RouteObject[] = [
  {
    element: <ChatWrapper />,
    children: [
      {
        path: '/',
        element: <Chat />,
        children: [
          { path: '/', element: <Lobby /> },
          { path: ':conversationId', element: <Room /> },
        ],
      },
    ],
  },
];

export default chatRoutes;