export async function GET(request: Request) {
  const backendUrl =
    process.env.BACKEND_URL?.trim() || 'http://localhost:4000';

  const url = new URL('/api/stories/popular', backendUrl);
  url.search = new URL(request.url).search;

  const response = await fetch(url, { cache: 'no-store' });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type':
        response.headers.get('Content-Type') ?? 'application/json',
    },
  });
}