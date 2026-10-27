import TravellersList, { type Traveller } from '@/components/TravellersList/TravellersList';
import css from './page.module.css';

const BACKEND_URL = process.env.BACKEND_URL?.trim() || 'http://localhost:4000';

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
  const travellers: Traveller[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const url = new URL('/api/users', BACKEND_URL);
    url.searchParams.set('page', String(page));
    url.searchParams.set('perPage', '100');

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Не вдалося завантажити мандрівників: ${res.status}`);
    }

    const result = parseTravellerPage(await res.json());
    if (result.hasNextPage && result.travellers.length === 0) {
      throw new Error('Сервер повернув порожню сторінку мандрівників із наступною сторінкою');
    }

    travellers.push(...result.travellers);
    hasNextPage = result.hasNextPage;
    page += 1;
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
