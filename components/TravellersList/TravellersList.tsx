'use client';

import { useState } from 'react';
import TravellerCard from '@/components/TravellerCard/TravellerCard';
import css from './TravellersList.module.css';

export interface Traveller {
  _id: string;
  name: string;
  avatarUrl?: string;
  articlesAmount: number;
}

const PER_PAGE = 12;

export default function TravellersList({
  travellers,
}: {
  travellers: Traveller[];
}) {
  const [visible, setVisible] = useState(PER_PAGE);

  return (
    <>
      <ul className={css.list}>
        {travellers.slice(0, visible).map((t) => (
          <TravellerCard
            key={t._id}
            id={t._id}
            name={t.name}
            avatarUrl={t.avatarUrl}
            articlesAmount={t.articlesAmount}
          />
        ))}
      </ul>

      {visible < travellers.length && (
        <button
          className={css.more}
          onClick={() => setVisible(visible + PER_PAGE)}
        >
          Показати ще
        </button>
      )}
    </>
  );
}