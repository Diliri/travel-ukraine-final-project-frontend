import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
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

  try {
    const formData = await request.formData();
    const response = await fetch(storiesUrl, {
      method: 'POST',
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
      body: formData,
      cache: 'no-store',
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch {
    return Response.json(
      { message: 'Не вдалося підключитися до сервера' },
      { status: 502 },
    );
  }
}
