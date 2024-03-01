import Axios from 'axios';

// const baseURL = "https://naerospace-chat-staging-f79d5af35fb9.herokuapp.com";
// const baseURL = "https://c1ed-102-88-81-84.ngrok-free.app";
// export const baseURL = "https://ngrok.localhost.direct:8443";
export const baseURL = "https://naerospace-chat-staging-f79d5af35fb9.herokuapp.com";
export const wsURL = "wss://naerospace-chat-staging-f79d5af35fb9.herokuapp.com/ws";

const chatAPI = Axios.create({
  baseURL
});

export default chatAPI;