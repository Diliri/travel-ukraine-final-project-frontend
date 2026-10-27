import { NextRequest } from 'next/server';

async function proxySavedStory(request: NextRequest, storyId: string, method: 'POST' | 'DELETE') {
  if (!/^[a-f\d]{24}$/i.test(storyId)) {
    return Response.json({ message: 'Invalid story ID' }, { status: 400 });
  }

  try {
    const configured = process.env.BACKEND_URL?.trim() || 'http://localhost:3000';
    const backendUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(configured) ? configured : `http://${configured}`;
    const url = new URL(`/api/users/saved-stories/${storyId}`, backendUrl);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid API URL');
    const response = await fetch(url, {
      method,
      headers: { Cookie: request.headers.get('cookie') ?? '' },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    return new Response(response.body, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('Content-Type') ?? 'application/json' },
    });
  } catch {
    return Response.json({ message: 'Failed to update saved story' }, { status: 502 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ storyId: string }> }) {
  const { storyId } = await context.params;
  return proxySavedStory(request, storyId, 'POST');
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ storyId: string }> }) {
  const { storyId } = await context.params;
  return proxySavedStory(request, storyId, 'DELETE');
}
