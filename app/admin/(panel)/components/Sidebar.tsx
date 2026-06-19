"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../../actions";

const NAV = [
  { href: "/admin", label: "Дашборд", icon: "▦" },
  { href: "/admin/course", label: "Курс", icon: "▤" },
  { href: "/admin/pages", label: "Страницы", icon: "▢" },
  { href: "/admin/orders", label: "Заказы", icon: "₽" },
  { href: "/admin/leads", label: "Заявки", icon: "✉" },
  { href: "/admin/users", label: "Пользователи", icon: "◍" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-xs font-bold text-white">
          СМ
        </span>
        <span className="font-semibold text-slate-800">Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-teal-light/60 font-medium text-teal-dark"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <Link
          href="/"
          target="_blank"
          className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50"
        >
          <span className="text-base">↗</span>
          Открыть сайт
        </Link>
        <form action={logout}>
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50">
            Выйти
          </button>
        </form>
      </div>
    </aside>
  );
}
