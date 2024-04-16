import { axios } from '@/lib/axios';
import { User } from '../types';

export const getMe = (): Promise<User> => {
  return axios.get('/auth/me');
};