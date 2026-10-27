// ЗАГЛУШКА: очищення cookies для налагодження вимкнене.
export async function POST() {
  return Response.json(
    { message: 'ЗАГЛУШКА: очищення cookies недоступне' },
    { status: 501 },
  );
}