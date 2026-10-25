import { nextServer } from '@/lib/api/api';
import type { User } from '@/types/user';
import type { Category } from '@/types/category';
export type { User };
import { type TravellersResponse } from '@/types/travellers';

export type CheckSessionResponse = {
  success: boolean;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: User;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const res = await nextServer.post<RegisterResponse>('/auth/register', data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};

export const checkSession = async (): Promise<boolean> => {
  const { data } = await nextServer.get<CheckSessionResponse>('/auth/session');
  return data.success;
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>('/auth/me');
  return data;
};

export type StoriesQueryParams = {
  categoryId?: string;
  page?: number;
  perPage?: number;
  type?: 'popular';
};

import { type StoriesResponse } from '@/types/story';

export async function getStoriesClient(
  params: StoriesQueryParams
): Promise<StoriesResponse> {
  const { categoryId, page = 1, perPage, type = 'popular' } = params;

  const { data } = await nextServer.get<StoriesResponse>('/stories', {
    params: {
      categoryId,
      page,
      perPage,
      type,
    },
  });

  return data;
}

export async function getTravellersClient(page = 1) {
  const { data } = await nextServer.get<TravellersResponse>('/users', {
    params: {
      page,
      perPage: 12,
    },
  });

  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await nextServer.get('/categories');

  return data;
}

import { type PublicTravellerProfileResponse } from '@/types/user';

export const getPublicTravellerProfileClient = async (
  travellerId: string,
  page = 1,
  perPage = 6
): Promise<PublicTravellerProfileResponse> => {
  const { data } = await nextServer.get<PublicTravellerProfileResponse>(
    `/users/${travellerId}/public`,
    {
      params: { page, perPage },
    }
  );

  return data;
};