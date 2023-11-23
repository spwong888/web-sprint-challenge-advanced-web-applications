// ✨ implement axiosWithAuth
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:9000/api', // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;