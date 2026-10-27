// ЗАГЛУШКА: проксі збереження історії ще не реалізовано.
export async function POST() {
  return Response.json(
    { message: 'ЗАГЛУШКА: збереження історії ще не реалізовано' },
    { status: 501 },
  );
}