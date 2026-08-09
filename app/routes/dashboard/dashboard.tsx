import { requireUserId } from "@auth/session.server";
import type { Route } from "./+types/dashboard";
import styles from "./dashboard.module.css";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Dashboard · purpleradish" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserId(request);
  return null;
}

export default function Dashboard(_: Route.ComponentProps) {
  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Dashboard</h1>
    </main>
  );
}
