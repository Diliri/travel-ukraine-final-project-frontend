import TravellersList, {
  type Traveller,
} from '@/components/TravellersList/TravellersList';
import css from './page.module.css';

const BACKEND_URL = process.env.BACKEND_URL?.trim() || 'http://localhost:4000';

async function getTravellers(): Promise<Traveller[]> {
  const res = await fetch(`${BACKEND_URL}/api/users`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Не вдалося завантажити мандрівників');
  return res.json();
}

export default async function TravellersPage() {
  const all = await getTravellers();
  const travellers = all.filter((t) => t.articlesAmount > 0);

  return (
    <section className={css.section}>
      <h1 className={css.title}>Мандрівники</h1>
      <TravellersList travellers={travellers} />
    </section>
  );
}