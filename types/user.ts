import { Story } from './story';

export type User = {
  _id: string;
  email: string;
  name: string;
  password: string;
  avatarUrl: string;
  articlesAmount?: number;
  savedArticlesAmount?: number;
  savedArticles?: string[];
  createAt: Date;
  updateAt: Date;
};

export type PublicTravellerProfileResponse = {
  user: User;
  stories: {
    data: Story[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
};