"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Щось пішло не так</h2>
      <p>{error.message}</p>
      <button type="button" onClick={() => reset()}>
        Спробувати ще раз
      </button>
    </div>
  );
}
