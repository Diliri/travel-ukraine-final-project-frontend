'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import ErrorWhileSavingModal from '@/components/ErrorWhileSavingModal/ErrorWhileSavingModal';
import StoryCard, { type StoryCardData } from '@/components/StoryCard/StoryCard';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ApiError } from '@/lib/api/profileApi';
import styles from './page.module.css';

type Story = StoryCardData & {
  desc?: string;
  article?: string;
  date?: string;
};

type Category = {
  _id: string;
  category: string;
};

type StoriesListProps = {
  initialStories: Story[];
  initialCategory?: string;
  initialCategories: Category[];
  categoriesError: string | null;
};

function getStoriesUrl(limit: 8 | 9, page: number, category?: string) {
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
  });

  if (category) {
    params.set('category', category);
  }

  return `/api/stories?${params.toString()}`;
}

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

export default function StoriesList({
  initialStories,
  initialCategory,
  initialCategories,
  categoriesError,
}: StoriesListProps) {
  const [stories, setStories] = useState(initialStories);
  const categories = initialCategories;
  const [limit, setLimit] = useState<8 | 9>(9);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialStories.length === 9);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteStoryIds, setFavoriteStoryIds] = useState<Record<string, boolean>>({});
  const [savingStoryId, setSavingStoryId] = useState<string | null>(null);
  const [isSavingModalOpen, setIsSavingModalOpen] = useState(false);
  const { data: currentUser, refetch: refetchCurrentUser } = useCurrentUser();
  const loadingRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);
  const pendingScrollId = useRef<string | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1440px)');

    const updateLimit = async (nextLimit: 8 | 9) => {
      if (nextLimit === limit || loadingRef.current) {
        return;
      }

      loadingRef.current = true;
      setIsLoading(true);

      try {
        const response = await fetch(getStoriesUrl(nextLimit, 1, initialCategory));
        if (!response.ok) {
          throw new Error(`Не вдалося завантажити історії: ${response.status}`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data) || !data.every(isStory)) {
          throw new Error('Сервер повернув некоректний список історій');
        }

        setStories(data);
        setLimit(nextLimit);
        setPage(1);
        setHasMore(data.length === nextLimit);
        setError(null);
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : 'Не вдалося завантажити історії'
        );
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    };

    const handleChange = (event: MediaQueryList | MediaQueryListEvent) => {
      void updateLimit(event.matches ? 9 : 8);
    };

    if ((desktop.matches ? 9 : 8) !== limit) {
      handleChange(desktop);
    }
    desktop.addEventListener('change', handleChange);

    return () => desktop.removeEventListener('change', handleChange);
  }, [limit, initialCategory]);

  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || !hasMore) {
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const response = await fetch(getStoriesUrl(limit, nextPage, initialCategory));
      if (!response.ok) {
        throw new Error(`Не вдалося завантажити історії: ${response.status}`);
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data) || !data.every(isStory)) {
        throw new Error('Сервер повернув некоректний список історій');
      }

      if (data.length > 0) {
        pendingScrollId.current = data[0]._id;
        setStories(currentStories => [...currentStories, ...data]);
        setPage(nextPage);
      }
      setHasMore(data.length === limit);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Не вдалося завантажити історії'
      );
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [hasMore, limit, page, initialCategory]);

  useEffect(() => {
    const endElement = endRef.current;
    if (!endElement || !hasMore || error) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          void loadNextPage();
        }
      },
      { rootMargin: '10px' }
    );

    observer.observe(endElement);
    return () => observer.disconnect();
  }, [error, hasMore, loadNextPage]);

  useEffect(() => {
    const storyId = pendingScrollId.current;
    if (!storyId) {
      return;
    }

    pendingScrollId.current = null;
    document.getElementById(`story-${storyId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [stories]);

  const toggleFavorite = async (storyId: string) => {
    if (savingStoryId) return;

    setSavingStoryId(storyId);
    try {
      let user = currentUser;
      if (!user) {
        const userResult = await refetchCurrentUser();

        if (userResult.error) {
          if (userResult.error instanceof ApiError && userResult.error.status === 401) {
            setIsSavingModalOpen(true);
          } else {
            toast.error(
              userResult.error instanceof Error
                ? userResult.error.message
                : 'Не вдалося перевірити авторизацію',
            );
          }
          return;
        }

        user = userResult.data;
      }

      if (!user) {
        setIsSavingModalOpen(true);
        return;
      }

      const isSaved =
        favoriteStoryIds[storyId] ?? user.savedArticles?.includes(storyId) ?? false;
      const shouldAdd = !isSaved;
      const response = await fetch(`/api/stories/${storyId}/favorite`, {
        method: shouldAdd ? 'POST' : 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        if (response.status === 401) {
          setIsSavingModalOpen(true);
          return;
        }
        throw new Error(payload?.message || 'Не вдалося оновити список улюблених');
      }

      setFavoriteStoryIds(current => ({
        ...current,
        [storyId]: shouldAdd,
      }));
      toast.success(shouldAdd ? 'Історію збережено' : 'Історію видалено зі збережених');
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : 'Не вдалося оновити список улюблених',
      );
    } finally {
      setSavingStoryId(null);
    }
  };

  const isStorySaved = (storyId: string) =>
    favoriteStoryIds[storyId] ??
    currentUser?.savedArticles?.includes(storyId) ??
    false;

  if (stories.length === 0 && !error) {
    return <p className={styles.empty}>Історій поки немає.</p>;
  }

  return (
    <>
      {categoriesError && <p role="alert">{categoriesError}</p>}
      {!categoriesError && categories.length > 0 && (
        <ul className={styles.categories} aria-label="Категорії статей">
          <li className={!initialCategory ? styles.active : undefined}>
            <Link href="/stories" aria-current={!initialCategory ? 'page' : undefined}>
              Усі категорії
            </Link>
          </li>

          {categories.map(category => {
            const isActive = initialCategory === category._id;

            return (
              <li key={category._id} className={isActive ? styles.active : undefined}>
                <Link
                  href={`/stories?category=${encodeURIComponent(category._id)}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {category.category}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <div className={styles.storiesContent}>
        {stories.length === 0 && !error && <p className={styles.empty}>Історій поки немає.</p>}
        {stories.length > 0 && (
          <ul className={styles.list} data-limit={limit}>
            {stories.map(story => (
              <li className={styles.item} id={`story-${story._id}`} key={story._id}>
                <StoryCard
                  story={story}
                  isSaved={isStorySaved(story._id)}
                  isSaving={savingStoryId === story._id}
                  onToggleSaved={storyId => void toggleFavorite(storyId)}
                />
            </li>
          ))}
        </ul>
      )}
      <div ref={endRef} aria-hidden="true" />
      {isLoading && <p className={styles.status}>Завантаження історій…</p>}
      {error && (
        <div className={styles.status} role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Оновити сторінку
          </button>
        </div>
      )}
      {!hasMore && stories.length > 0 && (
        <p className={styles.status}>Ви переглянули всі історії.</p>
      )}
      </div>
      {isSavingModalOpen && (
        <ErrorWhileSavingModal onClose={() => setIsSavingModalOpen(false)} />
      )}
    </>
  );
}