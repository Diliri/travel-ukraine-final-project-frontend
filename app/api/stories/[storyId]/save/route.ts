import { isAxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/app/api/api';

type Context = { params: Promise<{ storyId: string }> };

async function forward(
  request: NextRequest,
  { params }: Context,
  method: 'post' | 'delete',
) {
  try {
    const { storyId } = await params;

    const apiResponse = await api.request({
      method,
      url: `/stories/${encodeURIComponent(storyId)}/favorite`,
      headers: {
        'Accept-Language': request.headers.get('accept-language') || 'uk',
      },
    });

    return NextResponse.json(apiResponse.data, { status: apiResponse.status });
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status || 500;
      return NextResponse.json(
        error.response?.data ?? {
          status,
          message: 'Не вдалося оновити збережені історії',
        },
        { status },
      );
    }

    return NextResponse.json(
      { message: 'Не вдалося оновити збережені історії' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, context: Context) {
  return forward(request, context, 'post');
}

export async function DELETE(request: NextRequest, context: Context) {
  return forward(request, context, 'delete');
}