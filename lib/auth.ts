import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "self-facial-massage-dev-secret";
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
export const SESSION_COOKIE = "sfm_session";

function token(): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`${ADMIN_LOGIN}:${ADMIN_PASSWORD}`)
    .digest("hex");
}

export function checkCredentials(login: string, password: string): boolean {
  return login === ADMIN_LOGIN && password === ADMIN_PASSWORD;
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === token();
}
