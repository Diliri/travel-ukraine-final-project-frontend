import { socials } from "@/components/Footer/socials";
import css from "./SocialList.module.css";

export default function SocialList() {
  return (
    <ul className={css.list}>
      {socials.map(({ name, href, icon }) => (
        <li key={name}>
          <a
            href={href}
            className={css.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
          >
            <svg className={css.icon} aria-hidden="true">
              <use href={`/svg/icons.svg#${icon}`} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
