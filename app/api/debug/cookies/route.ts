// ЗАГЛУШКА: діагностика cookies вимкнена.
export async function GET() {
  return Response.json(
    { message: 'ЗАГЛУШКА: діагностика cookies недоступна' },
    { status: 501 },
  );
}