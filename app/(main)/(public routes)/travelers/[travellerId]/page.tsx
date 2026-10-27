import { redirect } from 'next/navigation';

export default async function TravelerPage({
  params,
}: {
  params: Promise<{ travellerId: string }>;
}) {
  const { travellerId } = await params;
  redirect(`/travellers/${encodeURIComponent(travellerId)}`);
}
