import styles from "./Logo.module.css";

const Logo = () => {
  return (
    <span className={styles.wordmark}>
      purple<span className={styles.wordmarkAccent}>radish</span>
    </span>
  );
};

export { Logo };
