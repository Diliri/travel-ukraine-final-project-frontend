import styles from './page.module.css';
import StoriesList from './StoriesList';

import { parseStoriesResponse, type StoriesResponse } from '@/lib/api/storiesResponse';

export const dynamic = 'force-dynamic';

async function getStories(limit: 8 | 9, page = 1): Promise<StoriesResponse> {
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

  return parseStoriesResponse(await response.json());
}

export default async function StoriesPage() {
  let result: StoriesResponse | null = null;
  try {
    result = await getStories(9);
  } catch {
    result = null;
  }

  return (
    <section className={styles.page} aria-labelledby="stories-title">
      <header className={styles.header}>
        <h1 id="stories-title">Статті</h1>
      </header>

      {!result ? (
        <div className={styles.status} role="alert">
          <p>Не вдалося завантажити історії. Спробуйте ще раз трохи пізніше.</p>
          <form action="/stories" method="get">
            <button type="submit">Спробувати ще раз</button>
          </form>
        </div>
      ) : (
        <StoriesList initialStories={result.stories} initialPagination={result.pagination} />
      )}
    </section>
  );
}
