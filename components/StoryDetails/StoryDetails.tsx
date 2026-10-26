import Image from 'next/image';
import Link from 'next/link';
import css from './StoryDetails.module.css';

export interface StoryDetailsData {
  _id: string;
  img: string;
  title: string;
  article?: string;
  date: string;
  category: { _id: string; category: string } | null;
  ownerId: { _id: string; name: string; avatarUrl?: string } | null;
}

const formatDate = (date: string) => {
  const [y, m, d] = date.slice(0, 10).split('-');
  return y && m && d ? `${d}.${m}.${y}` : date;
};

export default function StoryDetails({ story }: { story: StoryDetailsData }) {
  const paragraphs = (story.article ?? '')
    .split(/\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <article>
      {/* #67 — верхня частина статті */}
      <section className={css.header}>
        <div className={`container ${css.headerInner}`}>
          <div className={css.info}>
            <Link href="/stories" className={css.back}>
              <svg
                className={css.backIcon}
                width="7"
                height="12"
                viewBox="0 0 7 12"
                aria-hidden="true"
              >
                <path d="M2.09525 5.82675L6.4485 10.18C6.6185 10.35 6.69933 10.5489 6.691 10.7768C6.68267 11.0046 6.5935 11.2035 6.4235 11.3735C6.2535 11.5435 6.05042 11.6285 5.81425 11.6285C5.57808 11.6285 5.375 11.5435 5.205 11.3735L0.261 6.4295C0.169667 6.33817 0.103334 6.24283 0.0620003 6.1435C0.0206669 6.04433 0 5.93875 0 5.82675C0 5.71475 0.0206669 5.60917 0.0620003 5.51C0.103334 5.41067 0.169667 5.31533 0.261 5.224L5.23 0.255C5.4 0.0850003 5.60308 0 5.83925 0C6.07542 0 6.2785 0.0850003 6.4485 0.255C6.6185 0.425 6.7035 0.628084 6.7035 0.86425C6.7035 1.10042 6.6185 1.3035 6.4485 1.4735L2.09525 5.82675Z" />
              </svg>
              Всі статті
            </Link>

            <h1 className={css.title}>{story.title}</h1>

            <div className={css.meta}>
              {story.ownerId && (
                <p className={css.metaRow}>
                  <span className={css.metaLabel}>Автор статті</span>
                  <span>{story.ownerId.name}</span>
                </p>
              )}

              <p className={css.metaRow}>
                <span className={css.metaLabel}>Опубліковано</span>
                <time dateTime={story.date}>{formatDate(story.date)}</time>
              </p>

              {story.category && <span className={css.tag}>{story.category.category}</span>}
            </div>
          </div>

          <div className={css.imageWrap}>
            <Image
              src={story.img}
              alt={story.title}
              fill
              priority
              sizes="(min-width: 1440px) 755px, (min-width: 768px) 704px, 335px"
              className={css.image}
            />
          </div>
        </div>
      </section>

      {/* #68 — текст історії */}
      <section className={css.body}>
        <div className="container">
          <div className={css.bodyInner}>
            {paragraphs.map((p, i) => (
              <p key={i} className={css.paragraph}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
