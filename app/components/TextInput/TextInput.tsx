import styles from "./TextInput.module.css";

type Props = React.ComponentPropsWithRef<"input">;

export function TextInput({ className, ...props }: Props) {
  return <input {...props} className={className ? `${styles.input} ${className}` : styles.input} />;
}
