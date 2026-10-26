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

export type CreateStoryFormValues = {
  image: File | null;
  title: string;
  category: string;
  article: string;
};
