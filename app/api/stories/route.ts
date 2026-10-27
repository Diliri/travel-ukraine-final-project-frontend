import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const limit = request.nextUrl.searchParams.get('limit') ?? '9';
  const page = request.nextUrl.searchParams.get('page') ?? '1';
  const category = request.nextUrl.searchParams.get('category');

  if (!['8', '9'].includes(limit)) {
    return Response.json({ message: 'limit must be 8 or 9' }, { status: 400 });
  }

  if (!/^[1-9]\d*$/.test(page)) {
    return Response.json(
      { message: 'page must be a positive integer' },
      { status: 400 },
    );
  }

  const configuredBackendUrl =
    process.env.BACKEND_URL?.trim() || 'http://localhost:3000';
  const backendUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredBackendUrl)
    ? configuredBackendUrl
    : `http://${configuredBackendUrl}`;
  const storiesUrl = new URL('/api/stories', backendUrl);

  if (!['http:', 'https:'].includes(storiesUrl.protocol)) {
    return Response.json(
      { message: 'BACKEND_URL must use http:// or https://' },
      { status: 500 },
    );
  }

  storiesUrl.searchParams.set('perPage', limit);
  storiesUrl.searchParams.set('page', page);
  if (category) {
    storiesUrl.searchParams.set('category', category);
  }
  const response = await fetch(storiesUrl, { cache: 'no-store' });

  if (!response.ok) {
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      },
    });
  }

  const payload: unknown = await response.json();
  const stories =
    typeof payload === 'object' &&
    payload !== null &&
    'stories' in payload &&
    Array.isArray(payload.stories)
      ? payload.stories
      : null;

  if (!stories) {
    return Response.json(
      { message: 'Backend returned an invalid stories response' },
      { status: 502 },
    );
  }

  return Response.json(stories);
}
