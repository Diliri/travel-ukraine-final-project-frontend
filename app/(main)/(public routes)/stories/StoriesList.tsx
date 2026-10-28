'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { type Story } from '@/lib/api/storiesResponse';
import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';
import ErrorWhileSavingModal from '@/components/ErrorWhileSavingModal/ErrorWhileSavingModal';
import StoryCard from '@/components/StoryCard/StoryCard';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ApiError } from '@/lib/api/profileApi';
import { getStoriesClient } from '@/lib/api/clientApi';
import styles from './page.module.css';

type Category = {
  _id: string;
  category: string;
};

type StoriesListProps =
  | {
      mode?: 'listing';
      initialStories: Story[];
      initialCategory?: string;
      initialCategories: Category[];
      categoriesError: string | null;
    }
  | {
      mode: 'recommendations';
      initialStories: Story[];
      initialCategory?: never;
      initialCategories?: never;
      categoriesError?: never;
    };

function getErrorMessage(
  error: unknown,
  fallback = 'Сталася помилка. Спробуйте ще раз.'
): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) return error.message;
  return fallback;
}

export default function StoriesList(props: StoriesListProps) {
  // PROPS SETUP
  const { initialStories } = props;
  const mode = props.mode ?? 'listing';
  const isRecommendations = mode === 'recommendations';

  const initialCategory = isRecommendations ? undefined : props.initialCategory;
  const initialCategories = isRecommendations ? [] : props.initialCategories;
  const categoriesError = isRecommendations ? null : props.categoriesError;

  // ROUTER & TRANSITION
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();
  const listId = 'stories-list';

  // STORIES
  const [stories, setStories] = useState<Story[]>(initialStories);
  const categories = isRecommendations ? [] : (props.initialCategories ?? []);
  const [favoriteStoryIds, setFavoriteStoryIds] = useState<Record<string, boolean>>({});
  const [savingStoryId, setSavingStoryId] = useState<string | null>(null);

  // PAGINATION
  const [limit, setLimit] = useState<8 | 9>(9);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialStories.length === 9);
  const [paginationError, setPaginationError] = useState(false);

  // LOADERS
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSavingModalOpen, setIsSavingModalOpen] = useState(false);
  const { data: currentUser, refetch: refetchCurrentUser } = useCurrentUser();
  const loadingRef = useRef(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(
    async (targetPage: number, perPage: 8 | 9) => {
      const response = await getStoriesClient({
        categoryId: initialCategory,
        page: targetPage,
        perPage,
      });

      const pageStories = response.stories as Story[];
      const more = pageStories.length === perPage;

      return { pageStories, more };
    },
    [initialCategory]
  );

  useEffect(() => {
    if (isRecommendations) return;
    const desktop = window.matchMedia('(min-width: 1440px)');

    const updateLimit = async (nextLimit: 8 | 9) => {
      if (nextLimit === limit || loadingRef.current) return;

      loadingRef.current = true;
      setIsLoading(true);

      try {
        const { pageStories, more } = await fetchPage(1, nextLimit);
        setStories(pageStories);
        setLimit(nextLimit);
        setPage(1);
        setHasMore(more);
        setPaginationError(false);
        setError(null);
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Не вдалося завантажити історії'));
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    };

    const handleChange = (event: MediaQueryList | MediaQueryListEvent) => {
      void updateLimit(event.matches ? 9 : 8);
    };

    handleChange(desktop);
    desktop.addEventListener('change', handleChange);

    return () => desktop.removeEventListener('change', handleChange);
  }, [isRecommendations, limit, fetchPage]);

  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);
    setPaginationError(false);

    try {
      const nextPage = page + 1;
      const { pageStories, more } = await fetchPage(nextPage, limit);

      setStories(current => {
        const existingIds = new Set(current.map(story => story._id));
        return [...current, ...pageStories.filter(story => !existingIds.has(story._id))];
      });
      setPage(nextPage);
      setHasMore(more);
    } catch (requestError) {
      setPaginationError(true);
      setError(getErrorMessage(requestError, 'Не вдалося завантажити історії'));
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [hasMore, limit, page, fetchPage]);

  useEffect(() => {
    const node = endRef.current;
    if (!node || !hasMore || paginationError) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) void loadNextPage();
      },
      { rootMargin: '300px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, paginationError, loadNextPage, stories.length]);

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
            toast.error(getErrorMessage(userResult.error, 'Не вдалося перевірити авторизацію'));
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
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        if (response.status === 401) {
          setIsSavingModalOpen(true);
          return;
        }
        throw new Error(payload?.message || 'Не вдалося оновити список улюблених');
      }

      setFavoriteStoryIds(current => ({ ...current, [storyId]: shouldAdd }));

      setStories(current =>
        current.map(story =>
          story._id === storyId
            ? { ...story, rate: Math.max(0, story.rate + (shouldAdd ? 1 : -1)) }
            : story
        )
      );

      toast.success(shouldAdd ? 'Історію збережено' : 'Історію видалено зі збережених');
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, 'Не вдалося оновити список улюблених'));
    } finally {
      setSavingStoryId(null);
    }
  };

  const isStorySaved = (storyId: string) =>
    favoriteStoryIds[storyId] ?? currentUser?.savedArticles?.includes(storyId) ?? false;

  return (
    <>
      {mode === 'listing' && categoriesError && <p role="alert">{categoriesError}</p>}
      {mode === 'listing' && !categoriesError && categories.length > 0 && (
        <>
          <label className={styles.categorySelect}>
            Категорії
            <select
              value={initialCategory ?? ''}
              disabled={isLoading || isNavigating}
              onChange={event => {
                const category = event.target.value;
                startNavigation(() =>
                  router.push(category ? `/stories?category=${encodeURIComponent(category)}` : '/stories')
                );
              }}
            >
              <option value="">Усі категорії</option>
              {categories.map((category: Category) => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))}
            </select>
          </label>
          <ul className={styles.categories} aria-label="Категорії статей">
            <li className={!initialCategory ? styles.active : undefined}>
              <Link href="/stories" aria-current={!initialCategory ? 'page' : undefined}>
                Усі категорії
              </Link>
            </li>

            {categories.map((category: Category) => {
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
          <ul
            id={listId}
            className={`${styles.list} ${mode === 'recommendations' ? styles.recommendedList : ''}`}
            data-limit={limit}
            aria-busy={isLoading || isNavigating}
          >
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

        <div ref={endRef} aria-hidden="true" />

        {isLoading && <p className={styles.status}>Завантаження історій…</p>}

        {error && (
          <div className={styles.status} role="alert">
            <p>{error}</p>
            {paginationError ? (
              <button type="button" onClick={() => void loadNextPage()}>
                Спробувати ще раз
              </button>
            ) : (
              <button type="button" onClick={() => window.location.reload()}>
                Оновити сторінку
              </button>
            )}
          </div>
        )}

        {!hasMore && stories.length > 0 && (
          <p className={styles.status}>Ви переглянули всі історії.</p>
        )}
      </div>

      <ErrorWhileSavingModal
        isOpen={isSavingModalOpen}
        onClose={() => setIsSavingModalOpen(false)}
      />
    </>
  );
}