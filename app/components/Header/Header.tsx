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
      <div className={cx("container", styles.inner)}>
        <Logo />
        <div className={styles.auth}>
          <span className={styles.authHint}>Already running service?</span>
          <Link to="/login" prefetch="intent">
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
};

export { Header };
