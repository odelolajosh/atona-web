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

const getMe = async () => {
  const response = await axios.post('/users/auth');
  return response.data.user as ChatAPI.User;
}

const getConversations = async (userId: string) => {
  const response = await axios.get(`/users/${userId}/chatrooms`)
  return response.data.data as ChatAPI.Conversation[];
}

const getSearchResults = async (q: string) => {
  const response = await axios.get('/users/search', { params: { q } });
  return response.data.data as { id: string, name: string }[];
}

const getMessages = async (conversationId: string) => {
  const response = await axios.get(`chatrooms/${conversationId}/messages`);
  return response.data.data as ChatAPI.Message[];
}


const chatAPI = {
  client: axios,
  getConversations,
  getMessages,
  getMe,
  getSearchResults
}

export default chatAPI;