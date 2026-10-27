export type User = {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string;
  articlesAmount: number;
  savedArticles: string[];
  createdAt?: string;
  updatedAt?: string;
};
