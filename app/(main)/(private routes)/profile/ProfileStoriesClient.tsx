'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import StoryCard, { type StoryCardData } from '@/components/StoryCard/StoryCard';
import { CURRENT_USER_KEY } from '@/hooks/useCurrentUser';
import type { ProfileUser } from '@/lib/api/profileApi';
import styles from './ProfileStoriesClient.module.css';

type ProfileStory = StoryCardData;

function isProfileStory(value: unknown): value is ProfileStory {
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
    (!('author' in value) || typeof value.author === 'string') &&
    (!('ownerId' in value) ||
      typeof value.ownerId === 'string' ||
      (typeof value.ownerId === 'object' &&
        value.ownerId !== null &&
        'name' in value.ownerId &&
        typeof value.ownerId.name === 'string'))
  );
}

function getStoriesFromPayload(payload: unknown): ProfileStory[] {
  if (Array.isArray(payload) && payload.every(isProfileStory)) {
    return payload;
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'stories' in payload &&
    Array.isArray(payload.stories) &&
    payload.stories.every(isProfileStory)
  ) {
    return payload.stories;
  }

  throw new Error('Некоректна відповідь сервера.');
}

type ProfileStoriesClientProps = {
  mode?: 'own' | 'saved';
};

export default function ProfileStoriesClient({ mode = 'own' }: ProfileStoriesClientProps) {
  const queryClient = useQueryClient();
  const [stories, setStories] = useState<ProfileStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingStoryId, setSavingStoryId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStories() {
      setLoading(true);
      setError('');
      setStories([]);

      try {
        const endpoint =
          mode === 'saved' ? '/api/stories/saved' : '/api/stories/me';

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

        const data = getStoriesFromPayload(await response.json());

        if (!controller.signal.aborted) {
          setStories(data);
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

  const removeSavedStory = async (storyId: string) => {
    if (savingStoryId) return;

    setSavingStoryId(storyId);
    try {
      const response = await fetch(`/api/stories/${storyId}/favorite`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(payload?.message || 'Не вдалося видалити історію зі збережених.');
      }

      setStories(current => current.filter(story => story._id !== storyId));
      queryClient.setQueryData<ProfileUser | undefined>(CURRENT_USER_KEY, currentUser =>
        currentUser
          ? {
              ...currentUser,
              savedArticles: (currentUser.savedArticles ?? []).filter(id => id !== storyId),
            }
          : currentUser,
      );
      toast.success('Історію видалено зі збережених');
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : 'Не вдалося видалити історію зі збережених.',
      );
    } finally {
      setSavingStoryId(null);
    }
  };

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
        <div key={story._id} className={styles.profileStoriesItem}>
          <StoryCard
            story={story}
            isSaved={mode === 'saved'}
            isSaving={savingStoryId === story._id}
            onToggleSaved={mode === 'saved' ? removeSavedStory : undefined}
          />
        </div>
      ))}
    </section>
  );
}
