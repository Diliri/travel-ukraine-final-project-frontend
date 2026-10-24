'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './ProfileStoriesClient.module.css';

type ProfileStory = {
  _id: string;
  title: string;
};

type ProfileStoriesClientProps = {
  mode?: 'own' | 'saved';
};

export default function ProfileStoriesClient({ mode = 'own' }: ProfileStoriesClientProps) {
  const [stories, setStories] = useState<ProfileStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadStories() {
      setLoading(true);
      setError('');
      setStories([]);

      try {
        const endpoint = mode === 'saved' ? '/api/stories/saved' : '/api/stories/me';

        const response = await fetch(endpoint, {
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        });

        if (response.status === 401) {
          throw new Error('Потрібно увійти в акаунт.');
        }

        if (!response.ok) {
          throw new Error('Не вдалося завантажити історії.');
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Некоректна відповідь сервера.');
        }

        if (!controller.signal.aborted) {
          setStories(data as ProfileStory[]);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Не вдалося завантажити історії.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadStories();

    return () => controller.abort();
  }, [mode]);

  if (loading) {
    return <p>Завантаження історій...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (stories.length === 0) {
    const isSaved = mode === 'saved';

    return (
      <section className={styles.profileStoriesEmptyCard}>
        <h2 className={styles.profileStoriesEmptyTitle}>
          {isSaved
            ? 'У вас ще немає збережених історій, мерщій збережіть вашу першу історію!'
            : 'Ви ще нічого не публікували, поділіться своєю першою історією!'}
        </h2>

        <Link
          href={isSaved ? '/stories' : '/stories/create'}
          className={styles.profileStoriesButton}
        >
          {isSaved ? 'До історій' : 'Опублікувати історію'}
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.profileStoriesList}>
      {stories.map(story => (
        <article key={story._id} className={styles.profileStoriesItem}>
          <h2>{story.title}</h2>

          <Link href={`/stories/${story._id}`}>Переглянути історію</Link>
        </article>
      ))}
    </section>
  );
}
