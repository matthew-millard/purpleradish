import { data } from "react-router";
import { getUserId } from "@auth/session.server";
import { AuthCard } from "@components/AuthCard/AuthCard";
import { VerifyStatus } from "@components/VerifyStatus/VerifyStatus";
import { consumeVerificationToken, type VerificationResult } from "@domain/verification.server";
import type { Route } from "./+types/verify";

const HTTP_STATUS: Record<VerificationResult["status"], number> = {
  verified: 200,
  already_consumed: 200,
  expired: 410,
  invalid: 400,
};

export function meta(_: Route.MetaArgs) {
  return [{ title: "Verify email · purpleradish" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const token = new URL(request.url).searchParams.get("token");
  const authenticated = (await getUserId(request)) !== null;

  const result: VerificationResult = token
    ? await consumeVerificationToken(token)
    : { status: "invalid" };

  return data({ status: result.status, authenticated }, { status: HTTP_STATUS[result.status] });
}

export default function Verify({ loaderData }: Route.ComponentProps) {
  return (
    <AuthCard>
      <VerifyStatus status={loaderData.status} authenticated={loaderData.authenticated} />
    </AuthCard>
  );
}
