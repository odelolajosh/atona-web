namespace ChatAPI {
  export interface User {
    id: number,
    uuid: string,
    name: string,
    avatarUrl: string,
    online: boolean
  }

  export interface Room {
    chatRoomType: 0 | 1,
    created_at: string,
    id: number,
    name: string,
    updated_at: string,
    users: User[]
    uuid: string
  }

  export interface Conversation {
    id: number;
    uuid: string;
    users: {
      id: number;
      uuid: string;
      name: string;
      avatarUrl: string;
      online: boolean;
    }[];
    chatRoomType: 0;
    name: string;
    created_at: string;
    updated_at: string;
  }
}