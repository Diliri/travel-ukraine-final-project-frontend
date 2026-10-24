import Logo from "@/components/Logo/Logo"; // той самий логотип, що в Header (клік → /)
import SocialList from "@/components/SocialList/SocialList";
import FooterNav from "@/components/FooterNav/FooterNav";
import Copyright from "@/components/Copyright/Copyright";
import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.content}>
          <div className={css.logo}>
            <Logo />
          </div>
          <div className={css.social}>
            <SocialList />
          </div>
          <div className={css.nav}>
            <FooterNav />
          </div>
        </div>

        <hr className={css.divider} />
        <Copyright />
      </div>
    </footer>
  );
}
