import { NextRequest, NextResponse } from 'next/server';

function getBackendUrl() {
  const configuredBackendUrl = process.env.BACKEND_URL?.trim() || 'http://localhost:3000';

  return /^[a-z][a-z\d+.-]*:\/\//i.test(configuredBackendUrl)
    ? configuredBackendUrl
    : `http://${configuredBackendUrl}`;
}

async function proxyFavoriteRequest(
  request: NextRequest,
  storyId: string,
  method: 'POST' | 'DELETE',
) {
  const backendUrl = getBackendUrl();
  const favoriteUrl = new URL(`/api/stories/${storyId}/favorite`, backendUrl);

  if (!['http:', 'https:'].includes(favoriteUrl.protocol)) {
    return NextResponse.json(
      { message: 'BACKEND_URL must use http:// or https://' },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(favoriteUrl, {
      method,
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const text = await response.text();

    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    return NextResponse.json(data ?? { message: 'OK' }, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: 'Failed to update favorite story' },
      { status: 502 },
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ storyId: string }> },
) {
  const { storyId } = await context.params;
  return proxyFavoriteRequest(request, storyId, 'POST');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ storyId: string }> },
) {
  const { storyId } = await context.params;
  return proxyFavoriteRequest(request, storyId, 'DELETE');
}
