// lib/api/clientApi.ts
import api from '@/lib/api/api';

import type { User } from '@/types/user';
import type {
  Story,
  CreateStoryData,
  UpdateStoryData,
  StoryCategory,
} from '@/types/story';

/* ---------------- AUTH ---------------- */

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: User;
};

export async function register(
  payload: RegisterRequest,
): Promise<RegisterResponse | User> {
  const response = await api.post('/auth/register', payload);
  return response.data;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (payload: LoginRequest): Promise<User> => {
  const res = await api.post<User>('/auth/login', payload);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/users/me');
  return data;
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const { data } = await api.get<{ success: boolean }>('/auth/refresh');
    return data.success;
  } catch {
    return false;
  }
};

/* ---------------- USERS ---------------- */

export interface FetchUsersProps {
  page: number;
  perPage: number;
}

export interface UsersHttpResponse {
  page: number;
  perPage: number;
  totalAuthors: number;
  totalPages: number;
  users: User[];
}

export const fetchUsers = async (
  params: FetchUsersProps,
): Promise<UsersHttpResponse> => {
  const { data } = await api.get('/users', { params });
  return data;
};

export const fetchUserById = async (userId: string): Promise<User> => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

export const updateMe = async (payload: {
  name: string;
  article: string;
}): Promise<User> => {
  const { data } = await api.patch('/users/me', payload);
  return data;
};

export const updateAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('avatar', file);
  const { data } = await api.patch('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
};

/* ---------------- STORIES ---------------- */

export interface StoriesHttpResponse {
  stories: Story[];
  totalStories: number;
  offset?: number;
  limit?: number;
  hasMore?: boolean;
  page?: number;
  perPage?: number;
  totalPages?: number;
}

export interface FetchStoriesProps {
  page?: number;
  perPage?: number;
  offset?: number;
  limit?: number;
  category?: string;
}

export const fetchStories = async (
  params: FetchStoriesProps,
): Promise<StoriesHttpResponse> => {
  const { data } = await api.get('/stories', { params });
  return data;
};

export const fetchPopularStories = async (): Promise<{
  stories: Story[];
  totalStories: number;
}> => {
  const { data } = await api.get('/stories/popular');
  return data;
};

export const fetchCategories = async (): Promise<StoryCategory[]> => {
  const { data } = await api.get('/categories');
  return data;
};

export const fetchStoryById = async (id: string): Promise<Story> => {
  const { data } = await api.get(`/stories/${id}`);
  return data;
};

export const createStory = async (payload: CreateStoryData): Promise<Story> => {
  const formData = new FormData();
  if (payload.img instanceof File) {
    formData.append('storyImage', payload.img);
  }
  formData.append('title', payload.title);
  formData.append('article', payload.article);
  formData.append('category', payload.category);
  const { data } = await api.post<Story>('/stories', formData);
  return data;
};

export const updateStory = async (
  payload: UpdateStoryData,
  storyId: string,
): Promise<Story> => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === 'img') {
      if (value instanceof File) formData.append('storyImage', value);
      else if (typeof value === 'string') formData.append('storyImage', value);
      return;
    }
    formData.append(key, String(value));
  });
  const { data } = await api.patch<Story>(`/stories/${storyId}`, formData);
  return data;
};

/* ---------------- FAVORITES ---------------- */

export const addToFavouriteStory = async (id: string): Promise<string[]> => {
  const { data } = await api.post<string[]>(`/stories/${id}/save`);
  return data;
};

export const removeFavouriteStory = async (id: string): Promise<void> => {
  await api.delete(`/stories/${id}/save`);
};

export const fetchMyStories = async (
  params: FetchUsersProps,
): Promise<StoriesHttpResponse> => {
  const { data } = await api.get('/stories/me', { params });
  return data;
};

export const fetchFavouriteStories = async (
  params: FetchUsersProps,
): Promise<StoriesHttpResponse> => {
  const { data } = await api.get('/stories/saved', { params });
  return data;
};