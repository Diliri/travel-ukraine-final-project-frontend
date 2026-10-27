import { NextRequest, NextResponse } from 'next/server';

import serverApi, { ServerApiError }  from '@/app/api/api';

import { UsersHttpResponse } from '@/lib/api/clientApi';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const page = req.nextUrl.searchParams.get('page');

    const perPage = req.nextUrl.searchParams.get('perPage');

    const res = await serverApi.get<UsersHttpResponse>(
      '/users',

      {
        params: {
          page,
          perPage,
        },
      },
    );

    return NextResponse.json(res.data);
  } catch (error) {
    const err = error as ServerApiError;

    return NextResponse.json(
      {
        message: err.response?.data?.message || 'Internal server error',
      },

      {
        status: err.response?.status || 500,
      },
    );
  }
}
