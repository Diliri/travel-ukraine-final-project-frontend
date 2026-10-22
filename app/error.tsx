"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <h1>Сталася помилка</h1>
      <p>Не вдалося завантажити цю сторінку.</p>
      <button type="button" onClick={() => reset()}>
        Спробувати ще раз
      </button>
    </main>
  );
}
