import { axios } from '@/lib/axios';
import { UserResponse } from '../types';

export type LoginCredentialsDTO = {
  email: string;
  password: string;
};

export const loginWithEmailAndPassword = async (data: LoginCredentialsDTO) => {
  const response = await axios.post('/users/login', data);
  return response.data as UserResponse
};