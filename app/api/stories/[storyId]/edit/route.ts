// ЗАГЛУШКА: проксі редагування історії ще не реалізовано.
export async function PATCH() {
  return Response.json(
    { message: 'ЗАГЛУШКА: редагування історії ще не реалізовано' },
    { status: 501 },
  );
}