import Image from 'next/image';
import Link from 'next/link';
import css from './TravellerCard.module.css';

interface Props {
  id: string;
  name: string;
  avatarUrl?: string;
  articlesAmount: number;
}

export default function TravellerCard({
  id,
  name,
  avatarUrl,
  articlesAmount,
}: Props) {
  return (
    <li className={css.card}>
      {avatarUrl && (
        <Image
          className={css.avatar}
          src={avatarUrl}
          alt={name}
          width={130}
          height={130}
        />
      )}

      <div className={css.info}>
        <h3 className={css.name}>{name}</h3>
        <p className={css.count}>Статті: {articlesAmount}</p>
      </div>

      <Link className={css.link} href={`/travellers/${id}`}>
        Переглянути профіль
      </Link>
    </li>
  );
}