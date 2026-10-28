import css from './JoinUs.module.css';
import Link from 'next/link';
import Image from 'next/image';

type JoinUsProps = {
  isAuthenticated: boolean;
};

const JoinUs = ({ isAuthenticated }: JoinUsProps) => {
  return (
    <div className={css.wrapper}>
      <div className={css.container}>
        <section id="join" className={css.joinus}>
          <Image
            className={css.picture}
            src="/img/sections/join/join-us-bg.jpg"
            alt=""
            fill
            sizes="100vw"
            aria-hidden="true"
          />

          <div className={css.content}>
            <h2 className={css.title}>
              Приєднуйся до спільноти свідомих мандрівників
            </h2>

            <p className={css.description}>
              Стань частиною ком’юніті, де подорожі стають не лише пригодою,
              а й внеском у збереження природи. Тут ти знайдеш однодумців,
              поради для сталих мандрів та натхнення для нових маршрутів
              Україною.
            </p>

            <Link
              href={isAuthenticated ? '/profile' : '/register'}
              className={css.joinbtn}
            >
              {isAuthenticated ? 'Збережені статті' : 'Зареєструватися'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JoinUs;