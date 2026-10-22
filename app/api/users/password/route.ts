import { NextRequest, NextResponse } from 'next/server';

// Фронт викликає /api/users/password, бекенд має маршрут PATCH /api/users/me/password
export async function PATCH(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json({ message: 'BACKEND_URL is not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${backendUrl}/api/users/me/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') ?? '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json({ message: 'Failed to update password' }, { status: 502 });
  }
}
