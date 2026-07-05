import { Logo } from "@components/Logo/Logo";
import styles from "./Header.module.css";
import { Link } from "react-router";
import { cx } from "~/lib/cx";

interface Props {
  borderless?: boolean;
}

const Header = ({ borderless = false }: Props) => {
  return (
    <header className={cx(styles.header, borderless && styles.borderless)}>
      <div className={cx("pr-container", styles.inner)}>
        <Logo />
        <div className={styles.auth}>
          <span className={styles.authHint}>Already running service?</span>
          <Link to="/sign-in" prefetch="intent">
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
};

export { Header };
