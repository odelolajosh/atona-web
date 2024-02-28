import Axios from 'axios';

const baseURL = "";

const chatAPI = Axios.create({
  baseURL,
});

export default chatAPI;