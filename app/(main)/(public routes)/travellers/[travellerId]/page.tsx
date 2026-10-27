import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
import TravellerInfo from '@/components/TravellerInfo/TravellerInfo';
import Link from 'next/link';
import css from './page.module.css';

const API_URL = `${process.env.BACKEND_URL?.trim() || 'http://localhost:4000'}/api`;


interface Story {
  _id: string;
  title: string;
  img: string;
  rate: number;
  author?: string;
  date?: string;
}

interface TravellerResponse {
  profile: {
    _id: string;
    name: string;
    avatarUrl?: string;
    articlesAmount: number;
  };
  articles: Story[];
}

async function getTraveller(id: string): Promise<TravellerResponse | null> {
  const res = await fetch(`${API_URL}/users/${id}?page=1&perPage=6`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function TravellerPage({
  params,
}: {
  params: Promise<{ travellerId: string }>;
}) {
  const { travellerId } = await params;
  const data = await getTraveller(travellerId);

  if (!data) return <p>Такий користувач відсутній</p>;

  return (
    <section className={css.section}>
      <TravellerInfo
        name={data.profile.name}
        avatarUrl={data.profile.avatarUrl}
        articlesAmount={data.profile.articlesAmount}
      />

      <h2 className={css.title}>Статті Мандрівника</h2>

      {data.articles.length === 0 ? (
        <MessageNoStories
          text="Цей користувач ще не публікував історій"
          buttonText="Назад до історій"
          linkTo="/stories"
        />
      ) : (
        <ul className={css.list}>
          {data.articles.map((story) => (
            <li className={css.item} key={story._id}>
              <Link href={`/stories/${story._id}`}>{story.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}