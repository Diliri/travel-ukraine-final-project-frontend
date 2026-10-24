import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';


export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Відкрий Україну заново — еко-мандри для натхнення
          </h1>

          <p className={styles.description}>
            Подорожуй екологічно, відкривай заповідні місця,
            гори та річки України. Ми зібрали маршрути,
            які допоможуть побачити красу природи без шкоди для неї.
          </p>

          <Link href="/stories" className={styles.button}>
            Долучитись до мандрів
          </Link>
        </div>

        <div className={styles.imageWrapper}>
          {/* Тут фотографія з Figma */}
        </div>
      </div>
    </section>
  );
}