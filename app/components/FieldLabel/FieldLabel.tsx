import { cx } from "~/lib/cx";

type Props = React.ComponentPropsWithoutRef<"label"> & {
  visuallyHidden?: boolean;
};

const FieldLabel = ({ className, visuallyHidden = false, children, ...props }: Props) => {
  return (
    <label {...props} className={cx("pr-label", visuallyHidden && "sr-only", className)}>
      {children}
    </label>
  );
};

export { FieldLabel };
