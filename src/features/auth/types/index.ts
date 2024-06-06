import { Base } from "@/types";

export interface User extends Base {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
}

export type UserResponse = {
  // jwt: string;
  authToken: string;
  user: User;
};