import TravellersList, { type Traveller } from '@/components/TravellersList/TravellersList';
import css from './page.module.css';

const BACKEND_URL = process.env.BACKEND_URL?.trim() || 'http://localhost:3000';

function isTraveller(value: unknown): value is Traveller {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_id' in value &&
    typeof value._id === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'articlesAmount' in value &&
    typeof value.articlesAmount === 'number' &&
    (!('avatarUrl' in value) || typeof value.avatarUrl === 'string')
  );
}

function parseTravellerPage(
  payload: unknown,
): { travellers: Traveller[]; hasNextPage: boolean } {
  if (Array.isArray(payload) && payload.every(isTraveller)) {
    return { travellers: payload, hasNextPage: false };
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'travellers' in payload &&
    Array.isArray(payload.travellers) &&
    payload.travellers.every(isTraveller) &&
    'pagination' in payload &&
    typeof payload.pagination === 'object' &&
    payload.pagination !== null &&
    'hasNextPage' in payload.pagination &&
    typeof payload.pagination.hasNextPage === 'boolean'
  ) {
    return {
      travellers: payload.travellers,
      hasNextPage: payload.pagination.hasNextPage,
    };
  }

  throw new Error('Сервер повернув некоректний список мандрівників');
}

async function getTravellers(): Promise<Traveller[]> {
  const travellersUrl = new URL('/api/users', BACKEND_URL);
  travellersUrl.searchParams.set('page', '1');
  travellersUrl.searchParams.set('perPage', '100');

  const res = await fetch(travellersUrl, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Не вдалося завантажити мандрівників');

  const payload: unknown = await res.json();
  const travellers =
    typeof payload === 'object' &&
    payload !== null &&
    'travellers' in payload &&
    Array.isArray(payload.travellers)
      ? payload.travellers
      : null;

  if (
    !Array.isArray(travellers) ||
    !travellers.every(
      (traveller): traveller is Traveller =>
        typeof traveller === 'object' &&
        traveller !== null &&
        '_id' in traveller &&
        typeof traveller._id === 'string' &&
        'name' in traveller &&
        typeof traveller.name === 'string' &&
        'articlesAmount' in traveller &&
        typeof traveller.articlesAmount === 'number',
    )
  ) {
    throw new Error('Сервер повернув некоректний список мандрівників');
  }

  return travellers;
}

export default async function TravellersPage() {
  const all = await getTravellers();
  const travellers = all.filter(t => t.articlesAmount > 0);

  return (
    <section className={css.section}>
      <h1 className={css.title}>Мандрівники</h1>
      <TravellersList travellers={travellers} />
    </section>
  );
}
