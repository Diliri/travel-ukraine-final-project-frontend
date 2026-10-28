// Клієнтський axios → Next.js Route Handlers (/app/api)
import axios from 'axios';

export const nextServer = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});
