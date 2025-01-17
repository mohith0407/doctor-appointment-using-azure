import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // Make sure this matches your backend port
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance; 