import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>

        {/* Первый блок — текстовая колонка */}
        <div className={styles.textColumn}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              Відкрий Україну заново — еко-мандри для натхнення
            </h1>

            <p className={styles.description}>
              Подорожуй екологічно, відкривай заповідні місця, гори та
              річки України. Ми зібрали маршрути, які допоможуть
              побачити красу природи без шкоди для неї.
            </p>
          </div>

          {/* Отдельный блок с кнопкой */}
          <div className={styles.actions}>
            <Link href="/stories" className={styles.button}>
              Доєднатись до мандрів
            </Link>
          </div>

        </div>

        {/* Второй блок — фотография */}
        <div className={styles.imageWrapper} role="img" aria-label="Гірський пейзаж України" />

      </div>
    </section>
  );
}