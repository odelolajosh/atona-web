import { axios } from '@/lib/axios';
import { UserResponse } from '../types';

export type RegisterCredentialsDTO = {
  name: string;
  email: string;
  password: string;
};

export const registerWithEmailAndPassword = async (data: RegisterCredentialsDTO) => {
  const response = await axios.post('users', data);
  return response.data as UserResponse;
};