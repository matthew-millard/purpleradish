import { cx } from "~/lib/cx";
import styles from "./SubmitButton.module.css";

type Props = React.ComponentPropsWithRef<"button"> & {
  pendingChildren: React.ReactNode;
  pending?: boolean;
};

const SubmitButton = ({
  className,
  children,
  pendingChildren,
  pending,
  disabled,
  ...props
}: Props) => {
  const isPending = pending ?? Boolean(disabled);
  return (
    <button type="submit" className={cx(styles.submit, className)} disabled={disabled} {...props}>
      <span className={cx(!isPending && styles.hidden)} aria-hidden={!isPending}>
        {pendingChildren}
      </span>
      <span className={cx(isPending && styles.hidden)} aria-hidden={isPending}>
        {children}
      </span>
    </button>
  );
};

export { SubmitButton };
