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

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/auth/register", payload);
  return response.data;
}
