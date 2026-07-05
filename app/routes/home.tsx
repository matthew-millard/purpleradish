import { data, useFetcher } from "react-router";
import type { Route } from "./+types/home";
import { TextInput } from "@components/TextInput/TextInput";
import { validateWaitlistInput } from "../domain/waitlist";
import styles from "./home.module.css";
import { Header } from "~/components/Header/Header";

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

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const parsed = validateWaitlistInput(form);

  if (!parsed.ok) {
    return data({ ok: false as const, error: parsed.error }, { status: 400 });
  }

  const { getDb } = await import("../db/client");
  const { waitlistSignups } = await import("../db/schema");

  try {
    await getDb()
      .insert(waitlistSignups)
      .values(parsed.value)
      .onConflictDoNothing({ target: waitlistSignups.email });
  } catch (e) {
    console.error(`[home#action] waitlist insert failed: ${e}`);
    return data(
      {
        ok: false as const,
        error: "Something went wrong on our end. Try again in a minute.",
      },
      { status: 500 },
    );
  }

  return { ok: true as const };
}

export default function Home(_: Route.ComponentProps) {
  return (
    <div className={styles.page}>
      <Header />
      <main>
        <section className={styles.hero}>
          <span className={styles.badge}>Piloting soon in Ottawa</span>
          <h1 className={styles.headline}>No commissions. No app. No new hardware.</h1>
          <p className={styles.subhead}>
            Let your customers order right from WhatsApp, ChatGPT, Siri, or Claude and the order
            lands in the POS you already run.
          </p>
          <p className={styles.catchLine}>Built by the industry, for the industry.</p>
          <WaitlistForm />
        </section>

        <section className={styles.props}>
          <div className={styles.prop}>
            <p className={`${styles.propStat} pr-data`}>38s</p>
            <p className={styles.propLabel}>average order time</p>
            <p className={styles.propBody}>
              No menu scroll, no checkout flow. Regulars say what they want, wherever they already
              are, and it lands in your kitchen.
            </p>
          </div>
          <div className={styles.prop}>
            <p className={`${styles.propStat} pr-data`}>Zero</p>
            <p className={styles.propLabel}>new hardware</p>
            <p className={styles.propBody}>
              Orders flow straight into the POS you already run. Square first, more to follow.
            </p>
          </div>
          <div className={styles.prop}>
            <p className={`${styles.propStat} pr-data`}>1</p>
            <p className={styles.propLabel}>live orders board</p>
            <p className={styles.propBody}>
              Every conversation, order, and ready-for-pickup in one quiet screen built for service
              hours.
            </p>
          </div>
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

function WaitlistForm() {
  const fetcher = useFetcher<typeof action>();
  const submitting = fetcher.state !== "idle";
  const result = fetcher.data;

  if (result?.ok) {
    return (
      <p className={styles.formSuccess} role="status">
        <span className={styles.liveDot} aria-hidden="true" />
        You're on the list. We'll be in touch before the pilot opens.
      </p>
    );
  }

  return (
    <fetcher.Form method="post" className={styles.form}>
      <label className={styles.srOnly} htmlFor="email">
        Email address
      </label>
      <TextInput
        id="email"
        name="email"
        type="email"
        required
        placeholder="you@yourrestaurant.com"
        className={styles.emailInput}
        autoComplete="email"
      />
      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? "Joining…" : "Join the waitlist"}
      </button>
      {result && !result.ok ? (
        <p className={styles.formError} role="alert">
          {result.error}
        </p>
      ) : null}
    </fetcher.Form>
  );
}
