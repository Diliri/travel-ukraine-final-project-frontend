export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  const backendUrl =
    process.env.BACKEND_URL?.trim() || 'http://localhost:4000';

  const url = new URL(`/api/users/${encodeURIComponent(userId)}`, backendUrl);

  const response = await fetch(url, { cache: 'no-store' });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type':
        response.headers.get('Content-Type') ?? 'application/json',
    },
  });
}