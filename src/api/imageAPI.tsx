import axios, { AxiosInstance } from 'axios';

export const imageAPI : AxiosInstance = 
  axios
    .create({
      baseURL: 'http://localhost:4004/api'
    });

