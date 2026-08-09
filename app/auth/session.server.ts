import { createCookieSessionStorage, redirect } from "react-router";

const USER_ID_KEY = "userId";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Copy .env.example to .env and set a value (openssl rand -base64 32).",
    );
  }
  return secret;
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secrets: [getSessionSecret()],
  },
});

function getSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request): Promise<string | null> {
  const session = await getSession(request);
  const userId = session.get(USER_ID_KEY);
  return typeof userId === "string" ? userId : null;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
): Promise<string> {
  const userId = await getUserId(request);
  if (!userId) {
    const params = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${params}`);
  }
  return userId;
}

export async function requireAnonymous(request: Request, redirectTo = "/dashboard"): Promise<void> {
  const userId = await getUserId(request);
  if (userId) {
    throw redirect(redirectTo);
  }
}

export async function createUserSession(userId: string, redirectTo: string): Promise<Response> {
  const session = await storage.getSession();
  session.set(USER_ID_KEY, userId);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
}

export async function logout(request: Request, redirectTo = "/"): Promise<Response> {
  const session = await getSession(request);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.destroySession(session) },
  });
}
