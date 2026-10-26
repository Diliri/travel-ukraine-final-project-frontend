import { notFound } from 'next/navigation';
import StoryDetails, { type StoryDetailsData } from '@/components/StoryDetails/StoryDetails';

const BACKEND_URL = process.env.BACKEND_URL?.trim() || 'http://localhost:3000';

type Ref<T> = string | T | null;

interface RawStory extends Omit<StoryDetailsData, 'ownerId' | 'category'> {
  ownerId: Ref<{ _id: string; name: string; avatarUrl?: string }>;
  category: Ref<{ _id: string; category: string }>;
}

async function getJson<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BACKEND_URL}${path}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function getAuthor(ref: RawStory['ownerId']) {
  if (!ref) return null;
  if (typeof ref === 'object') return ref;

  const data = await getJson<{
    profile: { _id: string; name: string; avatarUrl?: string };
  }>(`/api/users/${ref}`);

  return data?.profile ?? null;
}

async function getCategory(ref: RawStory['category']) {
  if (!ref) return null;
  if (typeof ref === 'object') return ref;

  const categories = await getJson<unknown>('/api/categories');
  if (!Array.isArray(categories)) return null;

  return (categories as { _id: string; category: string }[]).find(c => c._id === ref) ?? null;
}

async function getStory(id: string): Promise<StoryDetailsData | null> {
  const res = await fetch(`${BACKEND_URL}/api/stories/${id}`, {
    cache: 'no-store',
  });

  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Не вдалося завантажити історію: ${res.status}`);

  const story: RawStory = await res.json();

  const [ownerId, category] = await Promise.all([
    getAuthor(story.ownerId),
    getCategory(story.category),
  ]);

  return { ...story, ownerId, category };
}

export default async function StoryByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getStory(id);

  if (!story) notFound();

  return <StoryDetails story={story} />;
}
