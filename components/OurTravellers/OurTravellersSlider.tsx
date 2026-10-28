'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import TravellerCard from '@/components/TravellerCard/TravellerCard';
import type { Traveller } from '@/components/TravellersList/TravellersList';
import css from './OurTravellers.module.css';

function usePerSlide() {
  const [perSlide, setPerSlide] = useState(4);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setPerSlide(mq.matches ? 4 : 3);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return perSlide;
}

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

const ArrowIcon = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: direction === 'left' ? 'rotate(180deg)' : undefined }}
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function OurTravellersSlider({
  travellers,
}: {
  travellers: Traveller[];
}) {
  const perSlide = usePerSlide();
  const slides = chunk(travellers, perSlide);

  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const sync = (s: SwiperType) => {
    setIsStart(s.isBeginning);
    setIsEnd(s.isEnd);
  };

  return (
    <>
      <Swiper
        key={perSlide}
        slidesPerView={1}
        onSwiper={(s) => {
          setSwiper(s);
          sync(s);
        }}
        onSlideChange={sync}
      >
        {slides.map((group, index) => (
          <SwiperSlide key={index}>
            <ul className={css.grid}>
              {group.map((t) => (
                <TravellerCard
                  key={t._id}
                  id={t._id}
                  name={t.name}
                  avatarUrl={t.avatarUrl}
                  articlesAmount={t.articlesAmount}
                />
              ))}
            </ul>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={css.arrows}>
        <button
          type="button"
          className={css.arrow}
          onClick={() => swiper?.slidePrev()}
          disabled={isStart}
          aria-label="Попередні мандрівники"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          className={css.arrow}
          onClick={() => swiper?.slideNext()}
          disabled={isEnd}
          aria-label="Наступні мандрівники"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>

      <Link href="/travellers" className={`${css.all} ${css.allBottom}`}>
        Всі мандрівники
      </Link>
    </>
  );
}