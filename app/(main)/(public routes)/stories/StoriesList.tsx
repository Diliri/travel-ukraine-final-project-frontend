'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Pagination from '@/components/Pagination/Pagination';
import { parseStoriesResponse, type Story, type PaginationMeta, type StoriesResponse } from '@/lib/api/storiesResponse';
import styles from './page.module.css';

type StoriesListProps = {
  initialStories: Story[];
  initialPagination?: PaginationMeta;
  pageSize?: 8 | 9;
  mode?: 'all' | 'recommendations';
};
type Category = {
  _id: string;
  category: string;
};

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

async function fetchStoriesPage(page: number, limit: number, category: string): Promise<StoriesResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) params.set('category', category);
  const response = await fetch(`/api/stories?${params}`);
  if (!response.ok) throw new Error(`Не вдалося завантажити історії: ${response.status}`);
  return parseStoriesResponse(await response.json());
}

export default function StoriesList({ initialStories, initialPagination, pageSize = 9, mode = 'all' }: StoriesListProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [stories, setStories] = useState(initialStories);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(initialPagination);
  const limit = pagination?.perPage ?? pageSize;
  const page = pagination?.page ?? 1;
  const hasMore = mode === 'all' && Boolean(pagination?.hasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationError, setPaginationError] = useState(false);
  const [favoriteStoryIds, setFavoriteStoryIds] = useState<Record<string, boolean>>({});
  const loadingRef = useRef(false);

  useEffect(() => {
    if (mode === 'recommendations') return;
    const controller = new AbortController();

    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories', {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Не вдалося завантажити категорії: ${response.status}`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data) || !data.every(isCategory)) {
          throw new Error('Сервер повернув некоректний список категорій');
        }

        setCategories(data);
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        setCategoriesError(
          requestError instanceof Error ? requestError.message : 'Не вдалося завантажити категорії'
        );
      }
    };

    void loadCategories();
    return () => controller.abort();
  }, [mode]);

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
      const result = await fetchStoriesPage(nextPage, limit, selectedCategory);
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
  }, [hasMore, limit, page, selectedCategory]);

  const changeCategory = async (category: string) => {
    if (loadingRef.current || category === selectedCategory) return;
    loadingRef.current = true;
    setIsLoading(true);
    setIsFiltering(true);
    setError(null);
    try {
      const result = await fetchStoriesPage(1, limit, category);
      setStories(result.stories);
      setSelectedCategory(category);
      setPagination(result.pagination);
      setPaginationError(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не вдалося завантажити історії');
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
      setIsFiltering(false);
    }
  };

  const toggleFavorite = async (storyId: string) => {
    const shouldAdd = !favoriteStoryIds[storyId];

    try {
      const response = await fetch(`/api/users/saved-stories/${storyId}`, {
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
        throw new Error(payload?.message || 'Не вдалося оновити список улюблених');
      }

      setFavoriteStoryIds(current => ({
        ...current,
        [storyId]: shouldAdd,
      }));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не вдалося оновити список улюблених',
      );
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <>
      {mode === 'all' && (categoriesError ? (
        <p role="alert">{categoriesError}</p>
      ) : (
        categories.length > 0 && (
          <div aria-busy={isFiltering}>
            <label className={styles.categorySelect}>
              Категорії
              <select
                value={selectedCategory}
                disabled={isLoading}
                onChange={event => void changeCategory(event.target.value)}
              >
                <option value="">Всі статті</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.category}</option>
                ))}
              </select>
            </label>
            <ul className={styles.categories} aria-label="Категорії статей">
              {[{ _id: '', category: 'Всі статті' }, ...categories].map(category => (
                <li key={category._id || 'all'}>
                  <button
                    type="button"
                    className={selectedCategory === category._id ? styles.active : undefined}
                    aria-pressed={selectedCategory === category._id}
                    disabled={isLoading}
                    onClick={() => void changeCategory(category._id)}
                  >
                    {category.category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      ))}
      {stories.length > 0 && (
        <ul id="stories-list" className={`${styles.list} ${mode === 'recommendations' ? styles.recommendedList : ''}`} data-limit={limit} aria-busy={isLoading}>
          {stories.map(story => (
            <li className={styles.item} id={`story-${story._id}`} key={story._id}>
              <article className={styles.card}>
                <Link
                  className={styles.imageLink}
                  href={`/stories/${story._id}`}
                  aria-label={`Читати історію: ${story.title}`}
                >
                  <Image
                    className={styles.image}
                    src={story.img}
                    alt={story.title}
                    width="421"
                    height="421"
                    unoptimized
                  />
                </Link>
                <div className={styles.content}>
                  <p className={styles.meta}>
                    <span>
                      {story.ownerId && typeof story.ownerId === 'object'
                        ? story.ownerId.name
                        : (story.author ?? 'Мандрівник')}{' '}
                      <svg
                        className={styles.dot}
                        width="3"
                        height="4"
                        viewBox="0 0 3 4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.50004 3.04001C1.23337 3.04001 0.980039 2.97334 0.740039 2.84001C0.513372 2.70668 0.333372 2.52668 0.200039 2.30001C0.0667058 2.07334 3.92199e-05 1.80668 3.92199e-05 1.50001C3.92199e-05 1.22001 0.0667058 0.966678 0.200039 0.740011C0.333372 0.513344 0.513372 0.333344 0.740039 0.20001C0.980039 0.0666771 1.23337 1.04904e-05 1.50004 1.04904e-05C1.76671 1.04904e-05 2.01337 0.0666771 2.24004 0.20001C2.46671 0.333344 2.64671 0.513344 2.78004 0.740011C2.92671 0.966678 3.00004 1.22001 3.00004 1.50001C3.00004 1.80668 2.92671 2.07334 2.78004 2.30001C2.64671 2.52668 2.46671 2.70668 2.24004 2.84001C2.01337 2.97334 1.76671 3.04001 1.50004 3.04001Z"
                          fill="#1B391B"
                        />
                      </svg>{' '}
                    </span>
                    <span className={styles.rate}>
                      {story.rate}
                      <svg
                        className={styles.small_flag}
                        width="16"
                        height="16"
                        viewBox="0 0 10 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.76633 10.2987L1.58733 11.6587C1.20889 11.8218 0.849722 11.7912 0.509833 11.5668C0.169944 11.3425 0 11.0251 0 10.6145V1.1395C0 0.831722 0.112611 0.564888 0.337833 0.338999C0.562944 0.112999 0.828833 0 1.1355 0H8.39717C8.70494 0 8.97178 0.112999 9.19767 0.338999C9.42367 0.564888 9.53667 0.831722 9.53667 1.1395V10.6145C9.53667 11.0251 9.36606 11.3425 9.02483 11.5668C8.68361 11.7912 8.32378 11.8218 7.94533 11.6587L4.76633 10.2987ZM4.76633 9.08383L8.39717 10.6145V1.1395H1.1355V10.6145L4.76633 9.08383ZM4.76633 1.1395H1.1355H8.39717H4.76633Z"
                          fill="black"
                        />
                      </svg>
                    </span>
                  </p>
                  <h2 className={styles.title}>
                    <Link href={`/stories/${story._id}`}>{story.title}</Link>
                  </h2>

                  <div className={styles.footer}>
                    <Link className={styles.readMore} href={`/stories/${story._id}`}>
                      Переглянути статтю
                    </Link>
                    <button
                      type="button"
                      className={styles.readMore_flag}
                      aria-label={
                        favoriteStoryIds[story._id] ? 'Видалити з улюблених' : 'Додати в улюблені'
                      }
                      onClick={() => void toggleFavorite(story._id)}
                      style={{
                        color: favoriteStoryIds[story._id] ? '#fff' : undefined,
                        backgroundColor: favoriteStoryIds[story._id] ? '#4a9849' : undefined,
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 10 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.76633 10.2987L1.58733 11.6587C1.20889 11.8218 0.849722 11.7912 0.509833 11.5668C0.169944 11.3425 0 11.0251 0 10.6145V1.1395C0 0.831722 0.112611 0.564888 0.337833 0.338999C0.562944 0.112999 0.828833 0 1.1355 0H8.39717C8.70494 0 8.97178 0.112999 9.19767 0.338999C9.42367 0.564888 9.53667 0.831722 9.53667 1.1395V10.6145C9.53667 11.0251 9.36606 11.3425 9.02483 11.5668C8.68361 11.7912 8.32378 11.8218 7.94533 11.6587L4.76633 10.2987ZM4.76633 9.08383L8.39717 10.6145V1.1395H1.1355V10.6145L4.76633 9.08383ZM4.76633 1.1395H1.1355H8.39717H4.76633Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
      {stories.length === 0 && !isLoading && !error && (
        <p className={styles.empty}>Історій у цій категорії поки немає.</p>
      )}
      {isFiltering && <p className={styles.status} role="status">Завантаження історій…</p>}
      {mode === 'all' && !isFiltering && <Pagination
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={loadNextPage}
        hasError={paginationError}
        controls="stories-list"
      />}
      <span className="visually-hidden" role="status">
        {isLoading ? 'Завантаження історій…' : `Завантажено історій: ${stories.length}`}
      </span>
      {error && (
        <div className={styles.status} role="alert">
          <p>{error}</p>
        </div>
      )}
    </>
  );
}
