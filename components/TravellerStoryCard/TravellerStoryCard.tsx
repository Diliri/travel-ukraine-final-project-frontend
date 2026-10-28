import Image from 'next/image';
import Link from 'next/link';
import css from './TravellerStoryCard.module.css';

export interface TravellerStory {
  _id: string;
  title: string;
  img: string;
  rate: number;
  author?: string;
  date?: string;
}

export default function TravellerStoryCard({
  story,
  authorName,
}: {
  story: TravellerStory;
  authorName: string;
}) {
  return (
    <article className={css.card}>
      <Link href={`/stories/${story._id}`} className={css.imageLink}>
        <Image
          className={css.image}
          src={story.img}
          alt={story.title}
          width={421}
          height={421}
          unoptimized
        />
      </Link>

      <div className={css.content}>
        <p className={css.meta}>
          <span>{story.author ?? authorName}</span>
          <span className={css.dot}>•</span>
          <span>{story.rate}</span>
        </p>

        <h3 className={css.title}>{story.title}</h3>

        <div className={css.footer}>
          <Link href={`/stories/${story._id}`} className={css.readMore}>
            Переглянути статтю
          </Link>
          {/* Закладка пока не подключена: подключит владелец общего StoryCard */}
          <button type="button" className={css.bookmark} aria-label="Зберегти історію">
            <svg width="20" height="20" viewBox="0 0 10 12" fill="none" aria-hidden="true">
              <path
                d="M4.76633 10.2987L1.58733 11.6587C1.20889 11.8218 0.849722 11.7912 0.509833 11.5668C0.169944 11.3425 0 11.0251 0 10.6145V1.1395C0 0.831722 0.112611 0.564888 0.337833 0.338999C0.562944 0.112999 0.828833 0 1.1355 0H8.39717C8.70494 0 8.97178 0.112999 9.19767 0.338999C9.42367 0.564888 9.53667 0.831722 9.53667 1.1395V10.6145C9.53667 11.0251 9.36606 11.3425 9.02483 11.5668C8.68361 11.7912 8.32378 11.8218 7.94533 11.6587L4.76633 10.2987ZM4.76633 9.08383L8.39717 10.6145V1.1395H1.1355V10.6145L4.76633 9.08383Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}