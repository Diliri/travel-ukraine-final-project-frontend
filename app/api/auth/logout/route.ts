import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json({ message: 'BACKEND_URL is not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`${backendUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    });

    const result = new NextResponse(null, {
      status: response.status,
    });

    for (const cookie of response.headers.getSetCookie()) {
      result.headers.append('set-cookie', cookie);
    }

    return result;
  } catch {
    return NextResponse.json({ message: 'Backend is unavailable' }, { status: 502 });
  }
}
