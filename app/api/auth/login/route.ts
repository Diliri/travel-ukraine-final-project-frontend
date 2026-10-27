import { isAxiosError } from 'axios';
import { parseSetCookie } from 'cookie';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/app/api/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiResponse = await api.post('/auth/login', body, {
      headers: {
        'Accept-Language': request.headers.get('accept-language') || 'uk',
      },
    });

    const cookieStore = await cookies();
    const setCookieHeaders = apiResponse.headers['set-cookie'];
    const setCookies = Array.isArray(setCookieHeaders)
      ? setCookieHeaders
      : setCookieHeaders
        ? [setCookieHeaders]
        : [];

    for (const setCookieHeader of setCookies) {
      const parsed = parseSetCookie(setCookieHeader);
      if (!parsed?.name || parsed.value === undefined) continue;

      cookieStore.set(parsed.name, parsed.value, {
        path: parsed.path || '/',
        httpOnly: parsed.httpOnly,
        secure: parsed.secure,
        sameSite: parsed.sameSite as 'lax' | 'strict' | 'none' | undefined,
        expires: parsed.expires,
        maxAge: parsed.maxAge,
      });
    }

    return NextResponse.json(apiResponse.data, { status: apiResponse.status });
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status || 500;
      return NextResponse.json(
        error.response?.data ?? {
          status,
          message: 'Не вдалося виконати вхід',
        },
        { status },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: 'Некоректний формат запиту' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: 'Не вдалося виконати вхід' },
      { status: 500 },
    );
  }
}