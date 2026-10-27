// ЗАГЛУШКА: діагностика поточного користувача вимкнена.
export async function GET() {
  return Response.json(
    { message: 'ЗАГЛУШКА: діагностика користувача недоступна' },
    { status: 501 },
  );
}