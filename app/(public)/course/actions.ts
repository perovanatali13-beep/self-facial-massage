"use server";

import { redirect } from "next/navigation";
import { checkCourseCode, createCourseSession, destroyCourseSession } from "@/lib/auth";

export async function courseLogin(_prev: unknown, formData: FormData) {
  const code = String(formData.get("code") || "");
  if (!checkCourseCode(code)) {
    return { error: "Неверный код доступа" };
  }
  await createCourseSession();
  redirect("/course");
}

export async function courseLogout() {
  await destroyCourseSession();
  redirect("/course/access");
}
