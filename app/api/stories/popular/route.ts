// ЗАГЛУШКА: проксі популярних історій ще не реалізовано.
export async function GET() {
  return Response.json(
    { message: 'ЗАГЛУШКА: популярні історії ще не реалізовано' },
    { status: 501 },
  );
}