import axios from "axios";

// Клієнтський axios → Next.js Route Handlers (/app/api)
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
