import Image from "next/image";
import Link from "next/link";
import styles from "./PopularStoriesSection.module.css";

export default function PopularStoriesSection() {
  return (
    <section
      className={styles.popularStories}
      aria-labelledby="popular-stories-title"
    >
      <div className={styles.container}>
        {/* Заголовок секции */}
        <h2
          id="popular-stories-title"
          className={styles.title}
        >
          Популярні статті
        </h2>

        {/* Список популярных статей */}
        <div className={styles.storiesList}>
          {/* Карточка статьи */}
          <article className={styles.storyCard}>
            {/* Изображение статьи */}
            <div className={styles.imageWrapper}>
              <Image
                src="/images/story-placeholder.jpg"
                alt="Карпатські гори"
                fill
                sizes="(max-width: 767px) 335px, 50vw"
                className={styles.storyImage}
              />
            </div>

            {/* Контент карточки */}
            <div className={styles.storyContent}>
              {/* Автор и рейтинг */}
              <div className={styles.storyMeta}>
                <span className={styles.author}>
                  Анастасія Олійник
                </span>

                <span className={styles.rating}>
                  <span>5</span>
                  <span aria-label="Рейтинг">★</span>
                </span>
              </div>

              {/* Название статьи */}
              <h3 className={styles.storyTitle}>
                Карпати для новачків: легкі маршрути вихідного дня
              </h3>

              {/* Кнопки карточки */}
              <div className={styles.cardActions}>
                <Link
                  href="/stories"
                  className={styles.readButton}
                >
                  Переглянути статтю
                </Link>

                <button
                  type="button"
                  className={styles.favoriteButton}
                  aria-label="Додати статтю до обраного"
                >
                  ♡
                </button>
              </div>
            </div>
          </article>
        </div>

        {/* Стрелки переключения карточек */}
        <div
          className={styles.sliderControls}
          aria-label="Навігація між статтями"
        >
          <button
            type="button"
            className={styles.arrowButton}
            aria-label="Попередня стаття"
          >
            ←
          </button>

          <button
            type="button"
            className={styles.arrowButton}
            aria-label="Наступна стаття"
          >
            →
          </button>
        </div>

        {/* Кнопка перехода ко всем статьям */}
        <Link
          href="/stories"
          className={styles.allStoriesButton}
        >
          Всі статті
        </Link>
      </div>
    </section>
  );
}