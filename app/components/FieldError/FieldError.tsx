import { cx } from "~/lib/cx";
import styles from "./FieldError.module.css";

interface Props {
  error: string | undefined;
}
const FieldError = ({ error }: Props) => {
  return (
    <p className={cx(styles.formError, error === undefined && "hidden")} role="alert">
      {error}
    </p>
  );
};

export { FieldError };
