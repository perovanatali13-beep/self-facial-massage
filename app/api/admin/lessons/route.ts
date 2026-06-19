import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAuthenticated } from "@/lib/auth";
import { upsertLesson, deleteLesson, getLesson } from "@/lib/data";
import type { Lesson } from "@/lib/types";

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Partial<Lesson> & { id?: string };
    const id = body.id && body.id !== "new" ? body.id : crypto.randomUUID();
    const lesson: Lesson = {
      id,
      day: Number(body.day) || 1,
      title: body.title || "Без названия",
      category: body.category || "",
      description: body.description || "",
      videoUrl: body.videoUrl || "",
      content: body.content || "",
      published: Boolean(body.published),
      date: body.date || new Date().toISOString().slice(0, 10),
    };
    await upsertLesson(lesson);
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  // toggle published
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const lesson = await getLesson(id);
  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });
  lesson.published = !lesson.published;
  await upsertLesson(lesson);
  return NextResponse.json({ ok: true, published: lesson.published });
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  await deleteLesson(id);
  return NextResponse.json({ ok: true });
}
