'use client';

import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import StoryCard from '@/components/StoryCard/StoryCard';
import { nextServer } from '@/lib/api/api';
import type { StoriesResponse, Story } from '@/lib/api/storiesResponse';
import styles from './PopularStoriesSection.module.css';
import CarouselArrowButton from '@/components/CarouselArrowButton/CarouselArrowButton';
import Loader from '@/components/Loader/Loader';

export default function PopularStoriesSection() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPopularStories() {
      try {
        const { data } = await nextServer.get<StoriesResponse>('/stories/popular', {
          params: {
            page: 1,
            perPage: 3,
          },
        });

        setStories(data.stories);
      } catch (requestError) {
        if (isAxiosError<{ message?: string }>(requestError)) {
          setError(
            requestError.response?.data?.message ?? 'Не вдалося завантажити популярні історії.'
          );
        } else {
          setError('Не вдалося завантажити популярні історії.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadPopularStories();
  }, []);

  const scrollStories = (direction: 'next' | 'previous') => {
    const list = listRef.current;
    const firstCard = list?.firstElementChild;

    if (!list || !(firstCard instanceof HTMLElement)) return;

    const maxScroll = list.scrollWidth - list.clientWidth;
    if (maxScroll <= 0) return;

    const atStart = list.scrollLeft <= 1;
    const atEnd = list.scrollLeft >= maxScroll - 1;
    const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;

    const nextPosition =
      direction === 'next'
        ? atEnd
          ? 0
          : Math.min(list.scrollLeft + step, maxScroll)
        : atStart
          ? maxScroll
          : Math.max(list.scrollLeft - step, 0);

    list.scrollTo({
      left: nextPosition,
      behavior: 'smooth',
    });
  };

  return (
    <section className={styles.section} aria-busy={isLoading}>
      <h2 className={styles.title}>Популярні історії</h2>

      {isLoading && <Loader />}

      {!isLoading && error && (
        <p className={styles.message} role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && stories.length === 0 && (
        <p className={styles.message}>Популярних історій поки немає.</p>
      )}

      {!isLoading && !error && stories.length > 0 && (
        <>
          <div className={styles.list} ref={listRef}>
            {stories.map(story => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>

          {stories.length > 1 && (
            <div className={styles.controls}>
              <CarouselArrowButton
                direction="previous"
                label="Попередні історії"
                onClick={() => scrollStories('previous')}
              />

              <CarouselArrowButton
                direction="next"
                label="Наступні історії"
                onClick={() => scrollStories('next')}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
