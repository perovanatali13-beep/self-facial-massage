import Link from "next/link";
import { getCourse, getLeads, getUsers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const course = await getCourse();
  const leads = await getLeads();
  const users = await getUsers();

  const stats = [
    { label: "Уроков в курсе", value: course.lessons.length, href: "/admin/course" },
    {
      label: "Опубликовано",
      value: course.lessons.filter((l) => l.published).length,
      href: "/admin/course",
    },
    { label: "Заявок на курс", value: leads.length, href: "/admin/leads" },
    { label: "Пользователей", value: users.length, href: "/admin/users" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Дашборд</h1>
      <p className="mt-1 text-sm text-slate-500">
        Управление лендингом и курсом по самомассажу лица.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal hover:shadow-sm"
          >
            <p className="text-3xl font-bold text-teal">{s.value}</p>
            <p className="mt-1 text-sm text-slate-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/pages"
          className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-teal"
        >
          <p className="font-semibold text-slate-800">Редактировать лендинг</p>
          <p className="mt-1 text-sm text-slate-500">
            Заголовки, об авторе, программа, цена, FAQ и контакты.
          </p>
        </Link>
        <Link
          href="/admin/course"
          className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-teal"
        >
          <p className="font-semibold text-slate-800">Управлять уроками</p>
          <p className="mt-1 text-sm text-slate-500">
            Добавляйте дни курса, видео и публикуйте уроки.
          </p>
        </Link>
      </div>
    </div>
  );
}
