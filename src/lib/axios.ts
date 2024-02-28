import Axios from 'axios';
import { apiUrl } from './const';

const axios = Axios.create({
  baseURL: apiUrl,
});

export default axios;