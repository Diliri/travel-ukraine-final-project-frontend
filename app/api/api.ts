import axios from "axios";

// Серверний axios → Node.js бекенд
export const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3000",
  withCredentials: true,
});
