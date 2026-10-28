'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination/Pagination';
import { parseStoriesResponse, type Story, type PaginationMeta } from '@/lib/api/storiesResponse';
import toast from 'react-hot-toast';
import ErrorWhileSavingModal from '@/components/ErrorWhileSavingModal/ErrorWhileSavingModal';
import StoryCard from '@/components/StoryCard/StoryCard';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ApiError } from '@/lib/api/profileApi';
import styles from './page.module.css';

type Category = {
  _id: string;
  category: string;
};

type StoriesListProps = {
  initialStories: Story[];
  initialCategory?: string;
  initialCategories?: Category[];
  categoriesError?: string | null;
  initialPagination?: PaginationMeta;
  mode?: 'all' | 'recommendations';
};

function getStoriesUrl(limit: number, page: number, category?: string) {
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
  });

  if (category) {
    params.set('category', category);
  }

  return `/api/stories?${params.toString()}`;
}

export default function StoriesList({
  initialStories,
  initialCategory,
  initialCategories = [],
  categoriesError = null,
  initialPagination,
  mode = 'all',
}: StoriesListProps) {
  const [stories, setStories] = useState(initialStories);
  const categories = initialCategories;
  const [pagination, setPagination] = useState(initialPagination);
  const limit = pagination?.perPage ?? 9;
  const page = pagination?.page ?? 1;
  const hasMore = mode === 'all' && Boolean(pagination?.hasNextPage);
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();
  const listId = mode === 'all' ? 'stories-list' : 'recommended-stories-list';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationError, setPaginationError] = useState(false);
  const [favoriteStoryIds, setFavoriteStoryIds] = useState<Record<string, boolean>>({});
  const [savingStoryId, setSavingStoryId] = useState<string | null>(null);
  const [isSavingModalOpen, setIsSavingModalOpen] = useState(false);
  const { data: currentUser, refetch: refetchCurrentUser } = useCurrentUser();
  const loadingRef = useRef(false);

  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || !hasMore) {
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);
    setPaginationError(false);

    try {
      const nextPage = page + 1;
      const response = await fetch(getStoriesUrl(limit, nextPage, initialCategory));
      if (!response.ok) {
        throw new Error(`Не вдалося завантажити історії: ${response.status}`);
      }

      const result = parseStoriesResponse(await response.json());
      const data = result.stories;

      if (data.length > 0) {
        setStories(currentStories => {
          const existingIds = new Set(currentStories.map(story => story._id));
          return [...currentStories, ...data.filter(story => !existingIds.has(story._id))];
        });
      }
      setPagination(result.pagination);
    } catch (requestError) {
      setPaginationError(true);
      setError(
        requestError instanceof Error ? requestError.message : 'Не вдалося завантажити історії'
      );
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [hasMore, limit, page, initialCategory]);

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
                : 'Не вдалося перевірити авторизацію'
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

      const isSaved = favoriteStoryIds[storyId] ?? user.savedArticles?.includes(storyId) ?? false;
      const shouldAdd = !isSaved;
      const response = await fetch(`/api/users/saved-stories/${storyId}`, {
        method: shouldAdd ? 'POST' : 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
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

      setStories(current =>
        current.map(story =>
          story._id === storyId
            ? {
                ...story,
                rate: Math.max(0, story.rate + (shouldAdd ? 1 : -1)),
              }
            : story
        )
      );

      toast.success(shouldAdd ? 'Історію збережено' : 'Історію видалено зі збережених');
    } catch (requestError) {
      toast.error(
        requestError instanceof Error ? requestError.message : 'Не вдалося оновити список улюблених'
      );
    } finally {
      setSavingStoryId(null);
    }
  };

  const isStorySaved = (storyId: string) =>
    favoriteStoryIds[storyId] ?? currentUser?.savedArticles?.includes(storyId) ?? false;

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <>
      {mode === 'all' && categoriesError && <p role="alert">{categoriesError}</p>}
      {mode === 'all' && !categoriesError && categories.length > 0 && (
        <>
        <label className={styles.categorySelect}>
          Категорії
          <select value={initialCategory ?? ''} disabled={isLoading || isNavigating}
            onChange={event => {
              const category = event.target.value;
              startNavigation(() => router.push(category ? `/stories?category=${encodeURIComponent(category)}` : '/stories'));
            }}>
            <option value="">Усі категорії</option>
            {categories.map(category => <option key={category._id} value={category._id}>{category.category}</option>)}
          </select>
        </label>
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
        </>
      )}
      <div className={styles.storiesContent}>
        {isNavigating && <p className={styles.status} role="status">Завантаження історій…</p>}
        {stories.length === 0 && !error && <p className={styles.empty}>Історій поки немає.</p>}
        {stories.length > 0 && (
          <ul id={listId} className={`${styles.list} ${mode === 'recommendations' ? styles.recommendedList : ''}`} data-limit={limit} aria-busy={isLoading || isNavigating}>
            {stories.map(story => (
              <li className={styles.item} id={`story-${story._id}`} key={story._id}>
                <StoryCard
                  story={{ ...story, ownerId: story.ownerId ?? undefined }}
                  isSaved={isStorySaved(story._id)}
                  isSaving={savingStoryId === story._id}
                  onToggleSaved={storyId => void toggleFavorite(storyId)}
                />
              </li>
            ))}
          </ul>
        )}
        {mode === 'all' && <Pagination
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={loadNextPage}
          controls={listId}
          hasError={paginationError}
        />}
        {error && (
          <div className={styles.status} role="alert">
            <p>{error}</p>

          </div>
        )}
        {mode === 'all' && !hasMore && stories.length > 0 && (
          <p className={styles.status}>Ви переглянули всі історії.</p>
        )}
      </div>
      {isSavingModalOpen && <ErrorWhileSavingModal onClose={() => setIsSavingModalOpen(false)} />}
    </>
  );
}
