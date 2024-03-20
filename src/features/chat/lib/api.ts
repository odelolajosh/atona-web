import Axios from 'axios';

export const baseURL = "https://naerospace-chat-staging-f79d5af35fb9.herokuapp.com";
export const wsURL = "wss://naerospace-chat-staging-f79d5af35fb9.herokuapp.com/ws";

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
  getMessages
}

export default chatAPI;