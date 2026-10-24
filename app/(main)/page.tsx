import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="container section">
      <h1>Відкрий Україну заново — еко-мандри для натхнення</h1>
      <p>Подорожуй екологічно, відкривай заповідні місця, гори та річки України. Ми зібрали маршрути, які допоможуть побачити красу природи без шкоди для неї.</p>
      <nav aria-label="Основна навігація">
        <Link href="/stories">Історії мандрівників</Link>{' · '}
        <Link href="/travellers">Мандрівники</Link>
      </nav>
    </section>
  );
}
