import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
import TravellerInfo from '@/components/TravellerInfo/TravellerInfo';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import serverApi from '@/app/api/api';
import css from './page.module.css';

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
  try {
    const { data } = await serverApi.get<TravellerResponse>(`/users/${encodeURIComponent(id)}`, {
      params: { page: 1, perPage: 6 },
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
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
          {data.articles.map(story => (
            <li className={css.item} key={story._id}>
              <Link href={`/stories/${story._id}`}>{story.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
