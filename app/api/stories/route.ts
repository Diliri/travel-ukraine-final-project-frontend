import { NextRequest } from 'next/server';
import { parseStoriesResponse } from '@/lib/api/storiesResponse';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const perPage = params.get('perPage') ?? params.get('limit') ?? '9';
  const page = params.get('page') ?? '1';
  const categoryId = params.get('categoryId') ?? params.get('category');
  const type = params.get('type');
  if (!['8', '9'].includes(perPage)) {
    return Response.json({ message: 'perPage must be 8 or 9' }, { status: 400 });
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

  storiesUrl.searchParams.set('perPage', perPage);
  storiesUrl.searchParams.set('page', page);
  if (categoryId) storiesUrl.searchParams.set('categoryId', categoryId);
  if (type) storiesUrl.searchParams.set('type', type);

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
  if (
  typeof payload !== 'object' ||
  payload === null ||
  !('stories' in payload) ||
  !Array.isArray(payload.stories)
) {
  return Response.json(
    { message: 'Backend returned an invalid stories response' },
    { status: 502 },
  );
}

  return Response.json(payload);
}
