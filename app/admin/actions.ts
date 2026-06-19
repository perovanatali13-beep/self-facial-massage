"use server";

import { redirect } from "next/navigation";
import { checkCredentials, createSession, destroySession } from "@/lib/auth";

export async function login(_prev: unknown, formData: FormData) {
  const loginValue = String(formData.get("login") || "");
  const password = String(formData.get("password") || "");
  if (!checkCredentials(loginValue, password)) {
    return { error: "Неверный логин или пароль" };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
