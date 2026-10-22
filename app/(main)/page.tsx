import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Відкрий для себе Україну</h1>
      <p>Надихайся історіями мандрівників і плануй наступну подорож.</p>
      <nav aria-label="Основна навігація">
        <Link href="/stories">Історії мандрівників</Link>
        {" · "}
        <Link href="/travellers">Мандрівники</Link>
      </nav>
    </main>
  );
}