import Axios from 'axios';
import { ChatAPI } from './types';
import { apiUrl } from './const';

export const baseURL = apiUrl;

const axios = Axios.create({
  baseURL
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authenticate = (token: string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const getMe = async () => {
  const response = await axios.post('/users/auth');
  return response.data.user as ChatAPI.User;
}

const getUsers = async () => {
  const response = await axios.get('/users');
  return response.data.users as ChatAPI.User[];
}

const getConversations = async (userId: string) => {
  const response = await axios.get(`/users/${userId}/chatrooms`)
  return response.data.chatRooms as ChatAPI.Conversation[];
}

const getMessages = async (conversationId: string) => {
  const response = await axios.get(`chatrooms/${conversationId}/messages`);
  return response.data.messages as ChatAPI.Message[];
}

const authenticateUser = async (name: string, macAddress: string) => {
  const response = await axios.post('/auth/user', { name, macAddress })
  return response.data.user as ChatAPI.User;
}

const registerUser = async (name: string, macAddress: string) => {
  const response = await axios.post('/users', { name, macAddress })
  return response.data.user as ChatAPI.User;
}

const chatAPI = {
  authenticateUser,
  registerUser,
  getUsers,
  getConversations,
  getMessages,
  authenticate,
  getMe
}

export default chatAPI;