import Link from "next/link";
import css from "./FooterNav.module.css";

const links = [
  { href: "/", label: "Головна" },
  { href: "/stories", label: "Статті" },
  { href: "/travellers", label: "Еко-Мандрівники" },
];

export default function FooterNav() {
  return (
    <nav aria-label="Навігація у футері">
      <ul className={css.list}>
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={css.link}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
