import Link from 'next/link';
import { notFound } from 'next/navigation';
import StoryDetails, { type StoryDetailsData } from '@/components/StoryDetails/StoryDetails';
import StoriesList, { type Story as StoryCard } from '../StoriesList';
import SaveStory from './SaveStory';
import styles from './page.module.css';

type Story = StoryCard & {
  category?: string | { _id?: string; category?: string };
  createdAt?: string;
};

export const dynamic = 'force-dynamic';

function apiUrl(path: string) {
  const configured = process.env.BACKEND_URL?.trim() || 'http://localhost:3000';
  const base = /^[a-z][a-z\d+.-]*:\/\//i.test(configured) ? configured : `http://${configured}`;
  const url = new URL(path, base);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid API URL');
  return url;
}

async function getArray(path: string): Promise<unknown[]> {
  const response = await fetch(apiUrl(path), { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error('API unavailable');
  const payload = await response.json();
  const data = payload?.data?.stories ?? payload?.data ?? payload;
  if (!Array.isArray(data)) throw new Error('Invalid API response');
  return data;
}

function isCard(value: unknown): value is StoryCard {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item._id === 'string' && typeof item.title === 'string'
    && typeof item.img === 'string' && typeof item.rate === 'number';
}

function isCategory(value: unknown): value is { _id: string; category: string } {
  return !!value && typeof value === 'object' && '_id' in value && typeof value._id === 'string'
    && 'category' in value && typeof value.category === 'string';
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();

  let story: Story | undefined;
  let missing = false;
  try {
    const response = await fetch(apiUrl(`/api/stories/${id}`), {
      cache: 'no-store', signal: AbortSignal.timeout(10_000),
    });
    missing = response.status === 404;
    if (response.ok) {
      const payload = await response.json();
      const data = payload?.data?.story ?? payload?.data ?? payload;
      if (typeof data?.title !== 'string') throw new Error('Invalid story');
      story = data as Story;
    }
  } catch {
    story = undefined;
  }
  if (missing) notFound();

  if (!story) return (
    <section className={styles.page}>
      <Link className={styles.back} href="/stories">Всі статті</Link>
      <div role="alert">
        <h1>Не вдалося завантажити історію</h1>
        <p>Спробуйте ще раз трохи пізніше.</p>
        <form action={`/stories/${id}`} method="get">
          <button className={styles.retry} type="submit">Спробувати ще раз</button>
        </form>
      </div>
    </section>
  );

  const [categories, latest] = await Promise.all([
    getArray('/api/categories').catch((): unknown[] => []),
    getArray('/api/stories?perPage=9&page=1').catch(() => null),
  ]);
  const categoryId = typeof story.category === 'string' ? story.category : story.category?._id;
  const categoryDoc = categories.filter(isCategory).find(item => item._id === categoryId);
  const categoryName = categoryDoc?.category
    ?? (typeof story.category === 'object' ? story.category?.category : undefined);
  const related = categoryName
    ? await getArray(`/api/stories?perPage=9&page=1&category=${encodeURIComponent(categoryName)}`).catch(() => [])
    : [];
  const recommendations = [...new Map(
    [...related, ...(latest ?? [])].filter(isCard).filter(item => item._id !== id)
      .map(item => [item._id, item]),
  ).values()].slice(0, 3);
  let owner: StoryDetailsData['ownerId'] = null;
  if (story.ownerId && typeof story.ownerId === 'object') {
    owner = { _id: '', name: story.ownerId.name };
  } else if (typeof story.ownerId === 'string') {
    try {
      const response = await fetch(apiUrl(`/api/users/${story.ownerId}`), {
        cache: 'no-store', signal: AbortSignal.timeout(10_000),
      });
      if (response.ok) {
        const payload = await response.json();
        owner = payload?.profile ?? payload?.data?.profile ?? null;
      }
    } catch {
      owner = null;
    }
  }
  if (!owner && story.author) owner = { _id: '', name: story.author };
  const details: StoryDetailsData = {
    _id: id,
    title: story.title,
    img: story.img,
    article: story.article || story.desc,
    date: story.date || story.createdAt || '',
    ownerId: owner,
    category: categoryName ? { _id: categoryId || '', category: categoryName } : null,
  };

  return (
    <div className={styles.page}>
      <StoryDetails story={details} />
      <div className="container">
        <div className={styles.body}><SaveStory key={id} storyId={id} /></div>
        <section className={styles.recommendations} aria-labelledby="recommendations-title">
        <h2 id="recommendations-title">Вам також сподобається</h2>
        {recommendations.length > 0 ? (
          <StoriesList key={id} initialStories={recommendations} initialNextStories={[]} mode="recommendations" />
        ) : <p>{latest === null ? 'Не вдалося завантажити рекомендації.' : 'Інших історій поки немає.'}</p>}
        </section>
      </div>
    </div>
  );
}
