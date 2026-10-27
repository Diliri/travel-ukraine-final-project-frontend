import Link from 'next/link';
import css from './MessageNoStories.module.css';

interface Props {
  text: string;
  buttonText: string;
  linkTo: string;
}

export default function MessageNoStories({ text, buttonText, linkTo }: Props) {
  return (
    <div className={css.box}>
      <p className={css.text}>{text}</p>
      <Link className={css.link} href={linkTo}>
        {buttonText}
      </Link>
    </div>
  );
}