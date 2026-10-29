'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import StoryCard from '@/components/StoryCard/StoryCard';
import type { StoryCardData } from '@/components/StoryCard/StoryCard';
import { nextServer } from '@/lib/api/api';
import type { StoriesResponse } from '@/lib/api/storiesResponse';
import styles from './PopularStoriesSection.module.css';
import CarouselArrowButton from '@/components/CarouselArrowButton/CarouselArrowButton';

// Фолбек-дані, якщо бекенд не відповів (для демо / офлайн)
const fallbackStories: StoryCardData[] = [
  {
    _id: 'karpaty-novachkiv',
    title: 'Карпати для новачків: легкі маршрути вихідного дня',
    shortTitle: 'Карпати для новачків: легкі маршрути вихідног...',
    img: '/img/sections/popular/karpaty-desk.jpg',
    imgMob: '/img/sections/popular/karpaty-mob.jpg',
    imgTab: '/img/sections/popular/karpaty-tab.jpg',
    rate: 5,
    author: 'Анастасія Олійник',
  },
  {
    _id: 'shatski-ozera',
    title: 'Шацькі озера: мандрівка до кришталевих вод',
    shortTitle: 'Шацькі озера: мандрівка до кришталевих вод',
    img: '/img/sections/popular/shatski-desk.jpg',
    imgTab: '/img/sections/popular/shatski-tab.jpg',
    rate: 5,
    author: 'Назар Ткаченко',
  },
  {
    _id: 'polissya',
    title: 'Полісся: мандрівка у світ пралісів',
    shortTitle: 'Полісся: мандрівка у світ пралісів',
    img: '/img/sections/popular/polissya-desk.jpg',
    rate: 5,
    author: 'Єва Бондаренко',
  },
];

export default function PopularStoriesSection() {
  const [stories, setStories] = useState<StoryCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  // Запит на бекенд: GET /stories/popular
  // Якщо бекенд не відповів — показуємо fallbackStories
  useEffect(() => {
    async function loadPopularStories() {
      try {
        const { data } = await nextServer.get<StoriesResponse>('/stories/popular', {
          params: { page: 1, perPage: 3 },
        });

        if (data.stories && data.stories.length > 0) {
          // Мапимо відповідь бекенду на формат StoryCardData
          const mapped: StoryCardData[] = data.stories.map(story => ({
            _id: story._id,
            title: story.title,
            img: story.img,
            rate: story.rate,
            author:
              typeof story.ownerId === 'object' && story.ownerId !== null
                ? story.ownerId.name
                : story.author,
          }));
          setStories(mapped);
        } else {
          setStories(fallbackStories);
        }
      } catch (requestError) {
        // Бекенд недоступний — використовуємо статику
        if (isAxiosError(requestError)) {
          console.warn('Popular stories API failed, using fallback');
        }
        setStories(fallbackStories);
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
      <div className={styles.header}>
        <h2 className={styles.title}>Популярні статті</h2>
        <Link href="/stories" className={styles.allStories}>
          Всі статті
        </Link>
      </div>

      {isLoading && <p className={styles.message}>Завантаження історій...</p>}

      {!isLoading && stories.length > 0 && (
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

      <Link href="/stories" className={styles.allStoriesMobile}>
        Всі статті
      </Link>
    </section>
  );
}