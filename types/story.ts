import { type Category } from './category';

export type Story = {
  _id: string;
  title: string;
  description: string;
  img: string;
  category: Category;
  ownerId: {
    _id: string;
    name: string;
  };
  rate?: number;
  createdAt: string;
  updatedAt: string;
};

export type StoriesResponse = {
  page: number;
  perPage: number;
  totalStories: number;
  totalPages: number;
  stories: Story[];
};

export type StoriesQueryParams = {
  categoryId?: string;
  page?: number;
  perPage?: number;
  type?: 'popular';
};

export interface ProfileStoriesResponse {
  data: Story[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export type StoryCategory = {
  _id: string;
  category: string;
};

export interface Owner {
  _id: string;
  name: string;
  avatarUrl: string;
}

export interface Story {
  _id: string;
  title: string;
  article: string;
  img: string;
  category: StoryCategory;
  ownerId: Owner;
  favoriteCount: number;
  date: string;
}

export interface StoriesResponse {
  stories: Story[];
  totalStories: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PopularStoriesResponse {
  stories: Story[];
  totalStories: number;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface GetStoriesParams extends PaginationParams {
  category?: string;
}

export interface CreateStoryParams {
  title: string;
  article: string;
  category: {
    _id: string;
    name: string;
  };
  ownerId: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  date: string;
  favoriteCount: number;
  img?: string;
}

export type CreateStoryData = {
  title: string;
  category: string;
  article: string;
  img?: File | string | null;
};

export type CreateStoryFormValues = {
  image: File | null;
  title: string;
  category: string;
  article: string;
};

export interface UpdateStoryData {
  title?: string;
  article?: string;
  category?: string; // ObjectId string
  img?: File | string | null;
}

export interface StoryCardUser {
  _id: string;
  name: string;
  avatarUrl?: string;
  totalFavorites?: number;
}

export interface StoryCardBase {
  _id: string;
  img: string;
  title: string;
  article?: string;
  description?: string;
  category: string;
  ownerId: string;
  favoriteCount: number;
  favouriteCount?: number;
  date: string;
}

export interface StoryCard extends StoryCardBase {
  ownerUser?: StoryCardUser;
}
