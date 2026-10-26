import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  const author = story.ownerId && typeof story.ownerId === 'object'
    ? story.ownerId.name || story.author : story.author;
  const date = new Date(story.date || story.createdAt || '');
  const dateLabel = Number.isNaN(date.getTime()) ? null
    : new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(date);
  const text = typeof story.article === 'string' && story.article ? story.article : story.desc || '';

  return (
    <div className={styles.page}>
      <article aria-labelledby="story-title">
        <header className={styles.hero}>
          <div className={styles.heading}>
            <Link className={styles.back} href="/stories">
              <Image src="/svg/story-chevron-left.svg" alt="" width={24} height={24} />
              Всі статті
            </Link>
            <h1 id="story-title">{story.title}</h1>
            <div className={styles.metadata}>
              <p><strong>Автор статті</strong> {author || 'Мандрівник'}</p>
              {dateLabel && <p><strong>Опубліковано</strong> <time dateTime={date.toISOString()}>{dateLabel}</time></p>}
              {categoryName && <span className={styles.tag}>{categoryName}</span>}
            </div>
          </div>
          {story.img && <Image className={styles.image} src={story.img} alt={story.title}
            width={1312} height={874} unoptimized loading="eager" />}
        </header>
        <div className={styles.body}>
          <div className={styles.text}>
            {text.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
          <SaveStory key={id} storyId={id} />
        </div>
      </article>
      <section className={styles.recommendations} aria-labelledby="recommendations-title">
        <h2 id="recommendations-title">Вам також сподобається</h2>
        {recommendations.length > 0 ? (
          <StoriesList key={id} initialStories={recommendations} initialNextStories={[]} mode="recommendations" />
        ) : <p>{latest === null ? 'Не вдалося завантажити рекомендації.' : 'Інших історій поки немає.'}</p>}
      </section>
    </div>
  );
}
