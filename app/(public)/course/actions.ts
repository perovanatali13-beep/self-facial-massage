"use server";

import { redirect } from "next/navigation";
import { checkCourseCode, createCourseSession, destroyCourseSession } from "@/lib/auth";
import { verifyAccessCode } from "@/lib/orders";

export async function courseLogin(_prev: unknown, formData: FormData) {
  const code = String(formData.get("code") || "").trim();
  // Принимаем общий пароль (для ручной выдачи) ИЛИ персональный код после оплаты.
  const ok = checkCourseCode(code) || (await verifyAccessCode(code));
  if (!ok) {
    return { error: "Неверный код доступа" };
  }
  await createCourseSession();
  redirect("/course");
}

export async function courseLogout() {
  await destroyCourseSession();
  redirect("/course/access");
}

/** Открыть курс после успешной оплаты (ставит cookie доступа). */
export async function enterCourse() {
  await createCourseSession();
  redirect("/course");
}
