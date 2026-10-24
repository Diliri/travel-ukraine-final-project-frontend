import Image from 'next/image';

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
    <div>
      {avatarUrl && <Image src={avatarUrl} alt={name} width={96} height={96} />}
      <h2>{name}</h2>
      <p>Статті: {articlesAmount}</p>
    </div>
  );
}