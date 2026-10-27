// ЗАГЛУШКА: проксі завантаження історії ще не реалізовано.
export async function GET() {
  return Response.json(
    { message: 'ЗАГЛУШКА: завантаження історії ще не реалізовано' },
    { status: 501 },
  );
}