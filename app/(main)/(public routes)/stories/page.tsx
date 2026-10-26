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

async function getStories(limit: 8 | 9, page = 1): Promise<Story[]> {
  const configuredBackendUrl =
    process.env.BACKEND_URL?.trim() || 'http://localhost:3000';
  const backendUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredBackendUrl)
    ? configuredBackendUrl
    : `http://${configuredBackendUrl}`;
  const storiesUrl = new URL('/api/stories', backendUrl);
  storiesUrl.searchParams.set('perPage', String(limit));
  storiesUrl.searchParams.set('page', String(page));

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

  const stories: unknown = await response.json();
  if (!Array.isArray(stories) || !stories.every(isStory)) {
    throw new Error('Сервер повернув некоректний список історій');
  }

  return stories;
}

export default async function StoriesPage() {
  let stories: Story[] = [];
  let loadFailed = false;

  try {
    stories = await getStories(9);
  } catch {
    loadFailed = true;
  }
  const nextStories = stories.length === 9
    ? await getStories(9, 2).catch(() => undefined)
    : [];

  return (
    <section className={styles.page} aria-labelledby="stories-title">
      <header className={styles.header}>
        <h1 id="stories-title">Статті</h1>
      </header>

      {loadFailed ? (
        <div className={styles.status} role="alert">
          <p>Не вдалося завантажити історії. Спробуйте ще раз трохи пізніше.</p>
          <form action="/stories" method="get">
            <button type="submit">Спробувати ще раз</button>
          </form>
        </div>
      ) : (
        <StoriesList initialStories={stories} initialNextStories={nextStories} />
      )}
    </section>
  );
}
