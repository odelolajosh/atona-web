import Axios from 'axios';
import { apiUrl } from './const';

const axios = Axios.create({
  baseURL: apiUrl,
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('unauthorized');
    }
    return Promise.reject(error);
  }
);


export { axios };