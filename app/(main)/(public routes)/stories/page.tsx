import styles from './page.module.css';
import StoriesList from './StoriesList';
import type { Story } from '@/types/story';
// import { parseStoriesResponse, type StoriesResponse } from '@/lib/api/storiesResponse';

type Category = {
  _id: string;
  category: string;
};

export const dynamic = 'force-dynamic';

function isCategory(value: unknown): value is Category {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_id' in value &&
    typeof value._id === 'string' &&
    'category' in value &&
    typeof value.category === 'string'
  );
}

async function getStories(limit: 8 | 9, category?: string): Promise<StoriesResponse> {
  const configuredBackendUrl = process.env.BACKEND_URL?.trim() || 'http://localhost:3000';
  const backendUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredBackendUrl)
    ? configuredBackendUrl
    : `http://${configuredBackendUrl}`;
  const storiesUrl = new URL('/api/stories', backendUrl);
  storiesUrl.searchParams.set('perPage', String(limit));
  storiesUrl.searchParams.set('page', '1');
  if (category) {
    storiesUrl.searchParams.set('category', category);
  }

  if (!['http:', 'https:'].includes(storiesUrl.protocol)) {
    throw new Error('BACKEND_URL має використовувати http:// або https://');
  }

  const response = await fetch(storiesUrl, {
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Не вдалося завантажити історії: ${response.status}`);
  }

  return parseStoriesResponse(await response.json());
}

async function getCategories(): Promise<Category[]> {
  const configuredBackendUrl =
    process.env.BACKEND_URL?.trim() || 'http://localhost:3000';
  const backendUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredBackendUrl)
    ? configuredBackendUrl
    : `http://${configuredBackendUrl}`;
  const categoriesUrl = new URL('/api/categories', backendUrl);

  if (!['http:', 'https:'].includes(categoriesUrl.protocol)) {
    throw new Error('BACKEND_URL має використовувати http:// або https://');
  }

  const response = await fetch(categoriesUrl, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити категорії: ${response.status}`);
  }

  const categories: unknown = await response.json();
  if (!Array.isArray(categories) || !categories.every(isCategory)) {
    throw new Error('Сервер повернув некоректний список категорій');
  }

  return categories;
}

type StoriesPageProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const params = await searchParams;
  const selectedCategory = typeof params.category === 'string' ? params.category : undefined;
  const [result, categoriesResult] = await Promise.all([
    getStories(9, selectedCategory).catch(() => null),
    getCategories().then(
      categories => ({ categories, error: null }),
      error => ({
        categories: [],
        error:
          error instanceof Error
            ? error.message
            : 'Не вдалося завантажити категорії',
      }),
    ),
  ]);

  return (
    <section className={styles.page} aria-labelledby="stories-title">
      <header className={styles.header}>
        <h1 id="stories-title">Статті</h1>
      </header>

      {result ? <StoriesList
        key={selectedCategory ?? 'all'}
        mode='listing'
        initialStories={stories}
        initialCategory={selectedCategory}
        initialCategories={categoriesResult.categories}
        categoriesError={categoriesResult.error}
      />
      </section>
  );
}