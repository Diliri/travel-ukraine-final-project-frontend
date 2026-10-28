import { notFound } from 'next/navigation';
import StoryDetails, { type StoryDetailsData } from '@/components/StoryDetails/StoryDetails';
import { parseStoriesResponse, type Story } from '@/lib/api/storiesResponse';
import StoriesList from '../StoriesList';
import SaveStory from './SaveStory';
import styles from './page.module.css';

const BACKEND_URL = process.env.BACKEND_URL?.trim() || 'http://localhost:3000';

async function getStory(id: string): Promise<StoryDetailsData | null> {
  const res = await fetch(`${BACKEND_URL}/api/stories/${id}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });

  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Не вдалося завантажити історію: ${res.status}`);

  return res.json();
}

async function getRecommendations(storyId: string): Promise<Story[]> {
  const response = await fetch(`${BACKEND_URL}/api/stories/${storyId}/recommendations?page=1&perPage=3`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error('Recommendations unavailable');
  return parseStoriesResponse(await response.json()).stories;
}

export default async function StoryByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();
  const story = await getStory(id);

  if (!story) notFound();

  let recommendations: Story[] = [];
  let recommendationsFailed = false;
  try {
    recommendations = await getRecommendations(id);
  } catch {
    recommendationsFailed = true;
  }

  return (
    <div className={styles.page}>
      <StoryDetails story={story} />
      <div className="container">
        <div className={styles.body}><SaveStory key={id} storyId={id} /></div>
        <section className={styles.recommendations} aria-labelledby="recommendations-title">
          <h2 id="recommendations-title">Вам також сподобається</h2>
          {recommendations.length > 0 ? (
            <StoriesList
  key={id}
  mode="recommendations"
  initialStories={recommendations}
/>
          ) : <p>{recommendationsFailed ? 'Не вдалося завантажити рекомендації.' : 'Інших історій поки немає.'}</p>}
        </section>
      </div>
    </div>
  );
} 
