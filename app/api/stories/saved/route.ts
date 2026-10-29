import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const configuredBackendUrl = process.env.BACKEND_URL?.trim();

  if (!configuredBackendUrl) {
    return Response.json({ message: 'BACKEND_URL is not configured' }, { status: 500 });
  }

  const backendUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredBackendUrl)
    ? configuredBackendUrl
    : `http://${configuredBackendUrl}`;
  const savedStoriesUrl = new URL('/api/stories/saved-stories', backendUrl);

  if (!['http:', 'https:'].includes(savedStoriesUrl.protocol)) {
    return Response.json({ message: 'BACKEND_URL must use http:// or https://' }, { status: 500 });
  }

  try {
    const response = await fetch(savedStoriesUrl, {
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    });

    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch saved stories from backend', error);
    return Response.json({ message: 'Backend unavailable' }, { status: 502 });
  }
}
