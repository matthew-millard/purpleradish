import type { ReactNode } from "react";
import styles from "./AuthCard.module.css";

interface Props {
  children: ReactNode;
}

const AuthCard = ({ children }: Props) => {
  return <div className={styles.card}>{children}</div>;
};

export { AuthCard };
