export type Story = {
  _id: string;
  img: string;
  title: string;
  rate: number;
  ownerId?: { _id?: string; name: string } | string;
  desc?: string;
  article?: string;
  author?: string;
  date?: string;
};

export type PaginationMeta = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type StoriesResponse = {
  stories: Story[];
  pagination: PaginationMeta;
};

export function isStory(value: unknown): value is Story {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  if (typeof item._id !== 'string' || typeof item.img !== 'string'
    || typeof item.title !== 'string' || typeof item.rate !== 'number'
    || !Number.isFinite(item.rate)) return false;
  if (!['desc', 'article', 'author', 'date'].every(key => item[key] === undefined || typeof item[key] === 'string')) return false;
  const owner = item.ownerId;
  return typeof owner === 'string'
    || (typeof owner === 'object' && owner !== null && 'name' in owner && typeof owner.name === 'string');
}

export function parseStoriesResponse(value: unknown): StoriesResponse {
  if (!value || typeof value !== 'object' || !('stories' in value)
    || !Array.isArray(value.stories) || !value.stories.every(isStory)
    || !('pagination' in value) || !value.pagination || typeof value.pagination !== 'object') {
    throw new Error('Сервер повернув некоректний список історій');
  }
  const meta = value.pagination as Record<string, unknown>;
  const integer = (key: string, minimum: number) => typeof meta[key] === 'number'
    && Number.isSafeInteger(meta[key]) && (meta[key] as number) >= minimum;
  if (!integer('page', 1) || !integer('perPage', 1) || !integer('totalItems', 0)
    || !integer('totalPages', 0) || typeof meta.hasNextPage !== 'boolean'
    || typeof meta.hasPreviousPage !== 'boolean') {
    throw new Error('Сервер повернув некоректну пагінацію');
  }
  return value as StoriesResponse;
}