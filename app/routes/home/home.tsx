import type { Route } from "./+types/home";
import styles from "./home.module.css";
import { Header } from "@components/Header/Header";
import { StatCard } from "@components/StatCard/StatCard";
import { stats } from "./home.data";
import { Badge } from "@components/Badge/Badge";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "purpleradish.io" },
    {
      name: "description",
      content:
        "Let your customers order right from WhatsApp, ChatGPT, Siri, or Claude and the order lands in the POS you already run. No commissions, no app, no new hardware.",
    },
  ];
}

export default function Home(_: Route.ComponentProps) {
  return (
    <div className={styles.page}>
      <Header />
      <main>
        <section className={styles.hero}>
          <Badge label="Piloting soon in Ottawa" />
          <h1 className={styles.headline}>No commissions. No app. No new hardware.</h1>
          <p className={styles.subhead}>
            Let your customers order right from WhatsApp, ChatGPT, Siri, or Claude and the order
            lands in the POS you already run.
          </p>
          <p className={styles.catchLine}>Built by the industry, for the industry.</p>
        </section>

        <section className={styles.props}>
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>
      </main>

      <footer className={styles.footer}>
        <img src="/brand/logo.svg" alt="" width="20" height="22" className={styles.footerMark} />
        <span className={styles.footerText}>
          purpleradish · built in Ontario · <span className="pr-data">2026</span>
        </span>
      </footer>
    </div>
  );
}
