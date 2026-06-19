"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Lesson } from "@/lib/types";

export default function CourseTable({ initial }: { initial: Lesson[] }) {
  const [lessons, setLessons] = useState(initial);
  const router = useRouter();

  async function toggle(id: string) {
    const res = await fetch("/api/admin/lessons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const { published } = await res.json();
      setLessons((ls) => ls.map((l) => (l.id === id ? { ...l, published } : l)));
    }
  }

  async function remove(id: string) {
    if (!confirm("Удалить урок?")) return;
    const res = await fetch("/api/admin/lessons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setLessons((ls) => ls.filter((l) => l.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th className="px-6 py-4 font-medium">День / Заголовок</th>
            <th className="px-6 py-4 font-medium">Категория</th>
            <th className="px-6 py-4 font-medium">Дата</th>
            <th className="px-6 py-4 font-medium">Опубликовано</th>
            <th className="px-6 py-4" />
          </tr>
        </thead>
        <tbody>
          {lessons.map((l) => (
            <tr key={l.id} className="border-b border-slate-100 last:border-0">
              <td className="px-6 py-4">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-light text-xs font-semibold text-teal-dark">
                  {l.day}
                </span>
                <span className="font-medium text-slate-800">{l.title}</span>
              </td>
              <td className="px-6 py-4 text-slate-500">{l.category || "—"}</td>
              <td className="px-6 py-4 text-slate-500">{l.date}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => toggle(l.id)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    l.published ? "bg-teal" : "bg-slate-300"
                  }`}
                  aria-label="toggle"
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                      l.published ? "left-[1.375rem]" : "left-0.5"
                    }`}
                  />
                </button>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/admin/course/${l.id}`}
                  className="text-teal hover:underline"
                >
                  Редактировать
                </Link>
                <button
                  onClick={() => remove(l.id)}
                  className="ml-4 text-slate-400 hover:text-red-500"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
          {lessons.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                Уроков пока нет. Нажмите «Добавить».
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
