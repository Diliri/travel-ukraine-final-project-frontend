import MessageNoStories from '@/components/MessageNoStories/MessageNoStories';
import TravellerInfo from '@/components/TravellerInfo/TravellerInfo';

const BACKEND_URL = process.env.BACKEND_URL?.trim() || 'http://localhost:4000';
const API_URL = `${BACKEND_URL}/api`;

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
  const res = await fetch(`${API_URL}/users/${id}?page=1&limit=6`, {
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
    <section>
      <TravellerInfo
        name={data.profile.name}
        avatarUrl={data.profile.avatarUrl}
        articlesAmount={data.profile.articlesAmount}
      />

      <h2>Статті Мандрівника</h2>

      {data.articles.length === 0 ? (
        <MessageNoStories
          text="Цей користувач ще не публікував історій"
          buttonText="Назад до історій"
          linkTo="/stories"
        />
      ) : (
        <ul>
          {data.articles.map((story) => (
            <li key={story._id}>{story.title}</li>
          ))}
        </ul>
      )}
    </section>
  );
}