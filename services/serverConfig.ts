import axios from 'axios';

// Same-origin API base works both locally and on deployed frontend.
export const nextApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
});
