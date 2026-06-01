import axios from 'axios';
import { getApiBaseUrl } from '../config/api';

const base = getApiBaseUrl();

export const api = axios.create({
  baseURL: base || undefined,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (!error.response && error.code === 'ERR_NETWORK') {
      const msg = import.meta.env.DEV
        ? 'Cannot connect to the API. Run npm run dev from the project root and wait for the server.'
        : 'Cannot connect to the API server.';
      return Promise.reject(new Error(msg));
    }
    return Promise.reject(error);
  }
);
