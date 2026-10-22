export async function GET() {
  const configuredBackendUrl =
    process.env.BACKEND_URL?.trim() || 'http://localhost:3000';
  const backendUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(configuredBackendUrl)
    ? configuredBackendUrl
    : `http://${configuredBackendUrl}`;
  const categoriesUrl = new URL('/api/categories', backendUrl);

  if (!['http:', 'https:'].includes(categoriesUrl.protocol)) {
    return Response.json(
      { message: 'BACKEND_URL must use http:// or https://' },
      { status: 500 },
    );
  }

  const response = await fetch(categoriesUrl, { cache: 'no-store' });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
    },
  });
}