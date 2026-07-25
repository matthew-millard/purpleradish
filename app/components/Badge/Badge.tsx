import styles from "./Badge.module.css";

interface Props {
  label: string;
}

const Badge = ({ label }: Props) => {
  return <span className={styles.badge}>{label}</span>;
};

export { Badge };
