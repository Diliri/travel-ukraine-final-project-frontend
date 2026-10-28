import Link from 'next/link';
import type { Traveller } from '@/components/TravellersList/TravellersList';
import OurTravellersSlider from './OurTravellersSlider';
import css from './OurTravellers.module.css';

const BACKEND_URL = process.env.BACKEND_URL?.trim() || 'http://localhost:4000';

async function getTravellers(): Promise<Traveller[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/users`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    const list: Traveller[] = Array.isArray(data)
      ? data
      : (data.travellers ?? data.data ?? []);
    return list.filter((t) => t.articlesAmount > 0).slice(0, 12);
  } catch {
    return [];
  }
}

export default async function OurTravellers() {
  const travellers = await getTravellers();
  if (travellers.length === 0) return null;

  return (
    <section className={css.section}>
      <div className={css.header}>
        <h2 className={css.title}>Наші Мандрівники</h2>
        <Link href="/travellers" className={`${css.all} ${css.allTop}`}>
          Всі мандрівники
        </Link>
      </div>

       <OurTravellersSlider travellers={travellers} />
    </section>
  );
}