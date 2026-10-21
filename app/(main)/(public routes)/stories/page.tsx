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

async function getStories(limit: 8 | 9): Promise<Story[]> {
  const configuredBackendUrl =
    process.env.BACKEND_URL?.trim() || 'http://localhost:3000';
  const backendUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredBackendUrl)
    ? configuredBackendUrl
    : `http://${configuredBackendUrl}`;
  const storiesUrl = new URL('/api/stories', backendUrl);
  storiesUrl.searchParams.set('limit', String(limit));
  storiesUrl.searchParams.set('page', '1');

  if (!['http:', 'https:'].includes(storiesUrl.protocol)) {
    throw new Error('BACKEND_URL має використовувати http:// або https://');
  }

  const response = await fetch(storiesUrl, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Не вдалося завантажити історії: ${response.status}`);
  }

  const stories: unknown = await response.json();
  if (!Array.isArray(stories) || !stories.every(isStory)) {
    throw new Error('Сервер повернув некоректний список історій');
  }

  return stories;
}

export default async function StoriesPage() {
  const stories = await getStories(9);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Статті</h1>
      </header>

      {stories.length === 0 ? (
        <p className={styles.empty}>Історій поки немає.</p>
      ) : (
        <StoriesList initialStories={stories} />
      )}
    </main>
  );
}
