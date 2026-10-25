import api from "./api";
import type { User } from "@/types/user";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/auth/register", payload);
  return response.data;
}

export const login = async (payload: LoginPayload): Promise<User> => {
    const res = await api.post<User>("/auth/login", payload);
    return res.data;
}
