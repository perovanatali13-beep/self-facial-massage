"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

export default function UsersManager({ initial }: { initial: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [form, setForm] = useState({ name: "", email: "", role: "Редактор" });
  const [adding, setAdding] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setAdding(false);
    if (res.ok) {
      const { user } = await res.json();
      setUsers((u) => [...u, user]);
      setForm({ name: "", email: "", role: "Редактор" });
      router.refresh();
    } else {
      alert("Не удалось добавить пользователя");
    }
  }

  async function remove(id: string) {
    if (!confirm("Удалить пользователя?")) return;
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setUsers((u) => u.filter((x) => x.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Пользователи</h1>
      <p className="mt-1 text-sm text-slate-500">Команда, имеющая доступ к админке.</p>

      <form
        onSubmit={add}
        className="mt-8 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-5"
      >
        <div className="flex-1 min-w-[160px]">
          <label className="mb-1 block text-xs font-medium text-slate-500">Имя</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="mb-1 block text-xs font-medium text-slate-500">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
          />
        </div>
        <div className="min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-slate-500">Роль</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
          >
            <option>Администратор</option>
            <option>Редактор</option>
          </select>
        </div>
        <button
          disabled={adding}
          className="rounded-lg bg-teal px-5 py-2 text-sm font-medium text-white hover:bg-teal-dark disabled:opacity-60"
        >
          + Добавить
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-6 py-4 font-medium">Имя</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Роль</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 last:border-0">
                <td className="px-6 py-4 font-medium text-slate-800">{u.name}</td>
                <td className="px-6 py-4 text-slate-500">{u.email}</td>
                <td className="px-6 py-4 text-slate-500">{u.role}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => remove(u.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
