import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const configuredBackendUrl = process.env.BACKEND_URL?.trim();

  if (!configuredBackendUrl) {
    return NextResponse.json(
      { message: 'BACKEND_URL is not configured' },
      { status: 500 },
    );
  }

  const backendUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredBackendUrl)
    ? configuredBackendUrl
    : `http://${configuredBackendUrl}`;
  const logoutUrl = new URL('/api/auth/logout', backendUrl);

  if (!['http:', 'https:'].includes(logoutUrl.protocol)) {
    return NextResponse.json(
      { message: 'BACKEND_URL must use http:// or https://' },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(logoutUrl, {
      method: 'POST',
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    });

    const result = new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      },
    });

    for (const cookie of response.headers.getSetCookie()) {
      result.headers.append('set-cookie', cookie);
    }

    return result;
  } catch {
    return NextResponse.json({ message: 'Backend is unavailable' }, { status: 502 });
  }
}
