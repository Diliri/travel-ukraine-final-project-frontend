import styles from './TravellerInfo.module.css';

type TravellerInfoProps = {
  name: string;
  email: string;
  avatarUrl?: string;
  articlesAmount?: number;
};

export default function TravellerInfo({
  name,
  email,
  avatarUrl,
  articlesAmount = 0,
}: TravellerInfoProps) {
  return (
    <section className={styles.profile}>
      <div className={styles.avatar}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={`Аватар ${name}`} />
        ) : (
          <span>{name.charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div className={styles.info}>
        <h1>{name}</h1>
        <p>{email}</p>
        <p>Мої історії: {articlesAmount}</p>
      </div>
    </section>
  );
}
