import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return Response.json({ message: 'BACKEND_URL is not configured' }, { status: 500 });
  }

  try {
    const url = new URL('/api/stories/me', backendUrl);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch {
    return Response.json({ message: 'Backend unavailable' }, { status: 502 });
  }
}
