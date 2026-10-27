'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './StoryCard.module.css';

export type StoryCardData = {
  _id: string;
  img: string;
  title: string;
  rate: number;
  ownerId?: { name: string } | string;
  author?: string;
};

type StoryCardProps = {
  story: StoryCardData;
  isSaved?: boolean;
  isSaving?: boolean;
  onToggleSaved?: (storyId: string) => void;
};

export default function StoryCard({
  story,
  isSaved = false,
  isSaving = false,
  onToggleSaved,
}: StoryCardProps) {
  const author =
    story.author ||
    (typeof story.ownerId === 'object' && story.ownerId !== null
      ? story.ownerId.name
      : undefined) ||
    'Мандрівник';

  return (
    <article className={styles.card}>
      <Link
        className={styles.imageLink}
        href={`/stories/${story._id}`}
        aria-label={`Читати історію: ${story.title}`}
      >
        <Image
          className={styles.image}
          src={story.img}
          alt={story.title}
          width={421}
          height={421}
          unoptimized
        />
      </Link>
      <div className={styles.content}>
        <p className={styles.meta}>
          <span>
            {author}{' '}
            <svg
              className={styles.dot}
              width="3"
              height="4"
              viewBox="0 0 3 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M1.50004 3.04001C1.23337 3.04001 0.980039 2.97334 0.740039 2.84001C0.513372 2.70668 0.333372 2.52668 0.200039 2.30001C0.0667058 2.07334 3.92199e-05 1.80668 3.92199e-05 1.50001C3.92199e-05 1.22001 0.0667058 0.966678 0.200039 0.740011C0.333372 0.513344 0.513372 0.333344 0.740039 0.20001C0.980039 0.0666771 1.23337 1.04904e-05 1.50004 1.04904e-05C1.76671 1.04904e-05 2.01337 0.0666771 2.24004 0.20001C2.46671 0.333344 2.64671 0.513344 2.78004 0.740011C2.92671 0.966678 3.00004 1.22001 3.00004 1.50001C3.00004 1.80668 2.92671 2.07334 2.78004 2.30001C2.64671 2.52668 2.46671 2.70668 2.24004 2.84001C2.01337 2.97334 1.76671 3.04001 1.50004 3.04001Z"
                fill="#1B391B"
              />
            </svg>
          </span>
          <span className={styles.rate}>
            {story.rate}
            <svg
              className={styles.smallFlag}
              width="16"
              height="16"
              viewBox="0 0 10 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4.76633 10.2987L1.58733 11.6587C1.20889 11.8218 0.849722 11.7912 0.509833 11.5668C0.169944 11.3425 0 11.0251 0 10.6145V1.1395C0 0.831722 0.112611 0.564888 0.337833 0.338999C0.562944 0.112999 0.828833 0 1.1355 0H8.39717C8.70494 0 8.97178 0.112999 9.19767 0.338999C9.42367 0.564999 9.53667 0.831833 9.53667 1.1395V10.6145C9.53667 11.0251 9.36606 11.3425 9.02483 11.5668C8.68361 11.7912 8.32378 11.8218 7.94533 11.6587L4.76633 10.2987ZM4.76633 9.08383L8.39717 10.6145V1.1395H1.1355V10.6145L4.76633 9.08383ZM4.76633 1.1395H1.1355H8.39717H4.76633Z"
                fill="black"
              />
            </svg>
          </span>
        </p>
        <h2 className={styles.title}>
          <Link href={`/stories/${story._id}`}>{story.title}</Link>
        </h2>
        <div className={styles.footer}>
          <Link className={styles.readMore} href={`/stories/${story._id}`}>
            Переглянути статтю
          </Link>
          {onToggleSaved && (
            <button
              type="button"
              className={styles.saveButton}
              disabled={isSaving}
              aria-busy={isSaving}
              aria-label={isSaving ? 'Збереження історії' : isSaved ? 'Видалити зі збережених' : 'Додати до збережених'}
              onClick={() => onToggleSaved(story._id)}
              style={{
                color: isSaved ? '#fff' : undefined,
                backgroundColor: isSaved ? '#4a9849' : undefined,
              }}
            >
              {isSaving && <span className={styles.spinner} aria-hidden="true" />}
              <svg
                width="24"
                height="24"
                viewBox="0 0 10 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4.76633 10.2987L1.58733 11.6587C1.20889 11.8218 0.849722 11.7912 0.509833 11.5668C0.169944 11.3425 0 11.0251 0 10.6145V1.1395C0 0.831722 0.112611 0.564888 0.337833 0.338999C0.562944 0.112999 0.828833 0 1.1355 0H8.39717C8.70494 0 8.97178 0.112999 9.19767 0.338999C9.42367 0.564999 9.53667 0.831833 9.53667 1.1395V10.6145C9.53667 11.0251 9.36606 11.3425 9.02483 11.5668C8.68361 11.7912 8.32378 11.8218 7.94533 11.6587L4.76633 10.2987ZM4.76633 9.08383L8.39717 10.6145V1.1395H1.1355V10.6145L4.76633 9.08383ZM4.76633 1.1395H1.1355H8.39717H4.76633Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
