import { consumeVerificationToken } from "@domain/verification.server";
import type { Route } from "./+types/verify";

export async function loader({ request }: Route.LoaderArgs) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) {
    return { status: "invalid" as const };
  }
  const result = await consumeVerificationToken(token);
  return { status: result.status };
}

export default function Verify({ loaderData }: Route.ComponentProps) {
  return <main>{loaderData.status}</main>;
}
