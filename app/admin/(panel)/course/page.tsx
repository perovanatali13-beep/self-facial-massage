import Link from "next/link";
import { getCourse } from "@/lib/data";
import CourseTable from "./CourseTable";

export const dynamic = "force-dynamic";

export default async function CourseAdminPage() {
  const course = await getCourse();
  const lessons = [...course.lessons].sort((a, b) => a.day - b.day);

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Курс</h1>
          <p className="mt-1 text-sm text-slate-500">Уроки по дням</p>
        </div>
        <Link
          href="/admin/course/new"
          className="rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-dark"
        >
          + Добавить
        </Link>
      </div>

      <CourseTable initial={lessons} />
    </div>
  );
}
