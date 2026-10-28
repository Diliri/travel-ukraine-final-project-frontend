export type Traveller = {
  _id: string;
  name: string;
  avatarUrl: string;
  articlesAmount: number;
  storiesCount: number;
};

export type TravellersResponse = {
  users: Traveller[];
  page: number;
  perPage: number;
  totalUsers: number;
  totalPages: number;
};