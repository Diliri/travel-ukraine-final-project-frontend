import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>Сторінку не знайдено</h2>
      <Link href="/">На головну</Link>
    </div>
  );
}
