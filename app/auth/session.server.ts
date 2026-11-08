import { createCookieSessionStorage, redirect } from "react-router";
import { findUserById, type User } from "@domain/account.server";
import { ENV } from "@env";

const USER_ID_KEY = "userId";

const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secrets: [ENV.SESSION_SECRET],
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

export async function requireUser(request: Request): Promise<User> {
  const userId = await requireUserId(request);
  const user = await findUserById(userId);
  if (!user) {
    throw await logout(request, "/login");
  }
  return user;
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
