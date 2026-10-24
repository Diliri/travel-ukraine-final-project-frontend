import TravellersList, {
  type Traveller,
} from '@/components/TravellersList/TravellersList';

// ВРЕМЕННО: тестовые данные, пока бэкенд не работает.
// Когда бэкенд заработает, верни версию с fetch (она ниже, в комментарии).
async function getTravellers(): Promise<Traveller[]> {
  return [
    {
      _id: '1',
      name: 'Олександра Ткаченко',
      articlesAmount: 6,
      avatarUrl:
        'https://ftp.goit.study/img/harmoniq/users/6881563901add19ee16fd002.webp',
    },
    {
      _id: '2',
      name: 'Дарина Лисенко',
      articlesAmount: 1,
      avatarUrl:
        'https://ftp.goit.study/img/harmoniq/users/6881563901add19ee16fd003.webp',
    },
    {
      _id: '3',
      name: 'Богдан Коваль',
      articlesAmount: 27,
      avatarUrl:
        'https://ftp.goit.study/img/harmoniq/users/6881563901add19ee16fd011.webp',
    },
    { _id: '4', name: 'Олександра Дуже Довге Прізвище', articlesAmount: 3 },
  ];
}

/* НАСТОЯЩАЯ ВЕРСИЯ (вернуть, когда бэкенд заработает):

const BACKEND_URL = process.env.BACKEND_URL?.trim() || 'http://localhost:4000';
const API_URL = `${BACKEND_URL}/api`;

async function getTravellers(): Promise<Traveller[]> {
  const res = await fetch(`${API_URL}/users`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Не вдалося завантажити мандрівників');
  return res.json();
}
*/

export default async function TravellersPage() {
  const all = await getTravellers();
  const travellers = all.filter((t) => t.articlesAmount > 0);

  return (
    <section>
      <h1>Мандрівники</h1>
      <TravellersList travellers={travellers} />
    </section>
  );
}