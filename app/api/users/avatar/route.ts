import { NextRequest, NextResponse } from 'next/server';

// Фронт викликає /api/users/avatar, бекенд має маршрут PATCH /api/users/me/avatar
export async function PATCH(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json({ message: 'BACKEND_URL is not configured' }, { status: 500 });
  }

  try {
    const formData = await request.formData();

    const response = await fetch(`${backendUrl}/api/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
      body: formData,
    });

    const data = await response.json().catch(() => null);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json({ message: 'Failed to update avatar' }, { status: 502 });
  }
}
