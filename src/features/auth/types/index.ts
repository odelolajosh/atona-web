import { Base } from "@/types";

export interface User extends Base {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  role: 'ADMIN' | 'USER';
}

export type UserResponse = {
  jwt: string;
  user: User;
};