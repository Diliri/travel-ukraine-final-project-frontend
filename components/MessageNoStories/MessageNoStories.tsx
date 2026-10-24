import Link from 'next/link';

interface Props {
  text: string;
  buttonText: string;
  linkTo: string;
}

export default function MessageNoStories({ text, buttonText, linkTo }: Props) {
  return (
    <div>
      <p>{text}</p>
      <Link href={linkTo}>{buttonText}</Link>
    </div>
  );
}