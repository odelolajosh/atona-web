import { axios } from '@/lib/axios';
import { User } from '../types';

export const getMe = async () => {
  const response = await axios.get('/users/me');
  return response.data.user as User;
};