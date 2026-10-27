import styles from './page.module.css';
import StoriesList from './StoriesList';

type Story = {
  _id: string;
  img: string;
  title: string;
  desc?: string;
  article?: string;
  author?: string;
  date?: string;
  rate: number;
};

type Category = {
  _id: string;
  category: string;
};

export const dynamic = 'force-dynamic';

function isStory(value: unknown): value is Story {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_id' in value &&
    typeof value._id === 'string' &&
    'img' in value &&
    typeof value.img === 'string' &&
    'title' in value &&
    typeof value.title === 'string' &&
    'rate' in value &&
    typeof value.rate === 'number' &&
    (!('desc' in value) || typeof value.desc === 'string') &&
    (!('article' in value) || typeof value.article === 'string') &&
    (!('author' in value) || typeof value.author === 'string') &&
    (!('date' in value) || typeof value.date === 'string')
  );
}

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

async function getStories(limit: 8 | 9, category?: string): Promise<Story[]> {
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
  });

  if (!response.ok) {
    throw new Error(`Не вдалося завантажити історії: ${response.status}`);
  }

  const payload: unknown = await response.json();
  const stories = Array.isArray(payload)
    ? payload
    : typeof payload === 'object' &&
        payload !== null &&
        'stories' in payload &&
        Array.isArray(payload.stories)
      ? payload.stories
      : null;

  if (!Array.isArray(stories) || !stories.every(isStory)) {
    throw new Error('Сервер повернув некоректний список історій');
  }

  return stories;
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
  const [stories, categoriesResult] = await Promise.all([
    getStories(9, selectedCategory),
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
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Статті</h1>
      </header>

      <StoriesList
        key={selectedCategory ?? 'all'}
        initialStories={stories}
        initialCategory={selectedCategory}
        initialCategories={categoriesResult.categories}
        categoriesError={categoriesResult.error}
      />
    </main>
  );
}
