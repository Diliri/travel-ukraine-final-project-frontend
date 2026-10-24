import Image from 'next/image';
import styles from './TravellerInfo.module.css';

type TravellerInfoProps = {
  name: string;
  email: string;
  avatarUrl?: string;
  articlesAmount?: number;
};

export default function TravellerInfo({ name, avatarUrl, articlesAmount = 0 }: TravellerInfoProps) {
  return (
    <section className={styles.profileTraveller}>
      <div className={styles.profileTravellerAvatar}>
        {avatarUrl ? (
          <Image
            className={styles.profileTravellerAvatarImage}
            src={avatarUrl}
            alt={`Аватар ${name}`}
            width={120}
            height={120}
            unoptimized
          />
        ) : (
          <span>{name.charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div className={styles.profileTravellerDetails}>
        <h2 className={styles.profileTravellerName}>{name}</h2>
        <p className={styles.profileTravellerArticles}>Статей: {articlesAmount}</p>
      </div>
    </section>
  );
}
