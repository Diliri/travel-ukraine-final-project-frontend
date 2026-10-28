import { NextRequest } from 'next/server';

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

export const isValidObjectId = (value: string) => OBJECT_ID_RE.test(value);

export const jsonError = (message: string, status: number) =>
  Response.json({ message }, { status });

// BACKEND_URL — адреса Node.js бекенду (з /api або без нього, зі схемою або без).
function getBackendOrigin(): string | null {
  const configured = process.env.BACKEND_URL?.trim();
  if (!configured) return null;

  const withScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(configured)
    ? configured
    : `http://${configured}`;

  try {
    const url = new URL(withScheme);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

type ProxyOptions = {
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH';
  /** Які query-параметри запиту передати на бекенд (решта відкидається). */
  query?: string[];
};

/**
 * Спільний проксі Next Route Handler → Node.js бекенд.
 * Передає cookie користувача, повертає статус і тіло бекенду як є.
 */
export async function proxyToBackend(
  request: NextRequest,
  path: string,
  { method = 'GET', query = [] }: ProxyOptions = {},
) {
  const origin = getBackendOrigin();
  if (!origin) {
    return jsonError('BACKEND_URL is not configured', 500);
  }

  const url = new URL(path, origin);
  for (const key of query) {
    const value = request.nextUrl.searchParams.get(key);
    if (value !== null) url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url, {
      method,
      headers: { Cookie: request.headers.get('cookie') ?? '' },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch {
    return jsonError('Backend unavailable', 502);
  }
}