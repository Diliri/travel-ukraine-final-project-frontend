import Image from 'next/image';
import css from './TravellerInfo.module.css';

interface Props {
  name: string;
  avatarUrl?: string;
  articlesAmount: number;
}

export default function TravellerInfo({
  name,
  avatarUrl,
  articlesAmount,
}: Props) {
  return (
    <div className={css.wrapper}>
      {avatarUrl && (
        <Image
          className={css.avatar}
          src={avatarUrl}
          alt={name}
          width={130}
          height={130}
        />
      )}
      <div className={css.text}>
        <h2 className={css.name}>{name}</h2>
        <p className={css.count}>Статті: {articlesAmount}</p>
      </div>
    </div>
  );
}