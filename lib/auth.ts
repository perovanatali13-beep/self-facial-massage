import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "self-facial-massage-dev-secret";
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const COURSE_PASSWORD = process.env.COURSE_PASSWORD || "course";
export const SESSION_COOKIE = "sfm_session";
export const COURSE_COOKIE = "sfm_course";

function token(): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`${ADMIN_LOGIN}:${ADMIN_PASSWORD}`)
    .digest("hex");
}

// Общий токен «доступ к курсу открыт». Код (общий пароль или персональный код
// после оплаты) проверяется в момент входа; cookie далее просто подтверждает доступ.
function courseToken(): string {
  return crypto.createHmac("sha256", SECRET).update("course:access:v1").digest("hex");
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

/* ---------- Доступ к курсу (для студентов) ---------- */

export function checkCourseCode(code: string): boolean {
  return code === COURSE_PASSWORD;
}

export async function createCourseSession(): Promise<void> {
  const store = await cookies();
  store.set(COURSE_COOKIE, courseToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroyCourseSession(): Promise<void> {
  const store = await cookies();
  store.delete(COURSE_COOKIE);
}

/** Доступ к курсу есть у студента с кодом ИЛИ у администратора. */
export async function hasCourseAccess(): Promise<boolean> {
  const store = await cookies();
  if (store.get(SESSION_COOKIE)?.value === token()) return true;
  return store.get(COURSE_COOKIE)?.value === courseToken();
}
