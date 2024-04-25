import { RouteObject } from "react-router-dom";
import { Lobby, Room } from "../components";
import { Chat } from "./chat";
import { ChatWrapper } from "./chat-wrapper";

const chatRoutes: RouteObject[] = [
  {
    element: <ChatWrapper />,
    children: [
      {
        path: 'chat',
        element: <Chat />,
        children: [
          { index: true, element: <Lobby /> },
          { path: ':conversationId', element: <Room /> },
        ],
      },
    ],
  },
];

export default chatRoutes;