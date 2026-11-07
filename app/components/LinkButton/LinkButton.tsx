import { Link, type LinkProps } from "react-router";
import { cx } from "@lib/cx";
import styles from "./LinkButton.module.css";

type Props = LinkProps;

const LinkButton = ({ className, children, ...props }: Props) => {
  return (
    <Link className={cx(styles.button, className)} {...props}>
      {children}
    </Link>
  );
};

export { LinkButton };
