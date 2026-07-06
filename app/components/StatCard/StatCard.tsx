import styles from "./StatCard.module.css";

interface StatCardProps {
  stat: string;
  label: string;
  body: string;
}

const StatCard = ({ stat, label, body }: StatCardProps) => {
  return (
    <div className={styles.card}>
      <p className={`${styles.stat} pr-data`}>{stat}</p>
      <p className={styles.label}>{label}</p>
      <p className={styles.body}>{body}</p>
    </div>
  );
};

export { StatCard, type StatCardProps };
