/** Join class names, dropping falsy entries: cx(styles.header, borderless && styles.borderless) */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
