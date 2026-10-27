// Серверний axios → Node.js бекенд
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios';
import { cookies } from 'next/headers';

// Визначаємо baseURL
const baseURL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
  : (process.env.API_URL || 'http://localhost:3000');

console.log('INIT api baseURL =', baseURL);

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Інтерсептор для передачі кук (актуально для Next.js Server side)
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join('; ');

      if (cookieHeader) {
        const headers = config.headers as AxiosRequestHeaders;
        headers['Cookie'] = cookieHeader;
        config.headers = headers;
      }
    } catch {
      // Захист на випадок, якщо код випадково виконається на клієнті 
      // де cookies() з next/headers недоступні
    }

    return config;
  },
);

// Дублюємо експорт для повної сумісності (якщо десь імпортується як serverApi)
export const serverApi = api;

export type ServerApiError = AxiosError<{
  message?: string;
}>;

export default api;