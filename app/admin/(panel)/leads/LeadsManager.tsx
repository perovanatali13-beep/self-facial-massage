"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead } from "@/lib/types";

type Draft = { name: string; email: string; phone: string };

export default function LeadsManager({ initial }: { initial: Lead[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({ name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);

  function startEdit(l: Lead) {
    setEditingId(l.id);
    setDraft({ name: l.name, email: l.email, phone: l.phone });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({ name: "", email: "", phone: "" });
  }

  async function save(id: string) {
    if (!draft.name || !draft.email || !draft.phone) {
      alert("Заполните все поля");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/admin/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...draft }),
    });
    setBusy(false);
    if (res.ok) {
      setLeads((arr) => arr.map((l) => (l.id === id ? { ...l, ...draft } : l)));
      cancelEdit();
      router.refresh();
    } else {
      alert("Не удалось сохранить изменения");
    }
  }

  async function remove(id: string) {
    if (!confirm("Удалить заявку?")) return;
    setBusy(true);
    const res = await fetch("/api/admin/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBusy(false);
    if (res.ok) {
      setLeads((arr) => arr.filter((l) => l.id !== id));
      router.refresh();
    } else {
      alert("Не удалось удалить заявку");
    }
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal";

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Заявки на курс</h1>
      <p className="mt-1 text-sm text-slate-500">
        Обращения с формы покупки на лендинге.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-6 py-4 font-medium">Имя</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Телефон</th>
              <th className="px-6 py-4 font-medium">Дата</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const editing = editingId === l.id;
              return (
                <tr key={l.id} className="border-b border-slate-100 last:border-0">
                  {editing ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          value={draft.name}
                          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                          className={inputCls}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="email"
                          value={draft.email}
                          onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                          className={inputCls}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={draft.phone}
                          onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                          className={inputCls}
                        />
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(l.createdAt).toLocaleString("ru-RU")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3 whitespace-nowrap">
                          <button
                            onClick={() => save(l.id)}
                            disabled={busy}
                            className="font-medium text-teal hover:text-teal-dark disabled:opacity-60"
                          >
                            Сохранить
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={busy}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            Отмена
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium text-slate-800">{l.name}</td>
                      <td className="px-6 py-4 text-slate-500">{l.email}</td>
                      <td className="px-6 py-4 text-slate-500">{l.phone}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(l.createdAt).toLocaleString("ru-RU")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3 whitespace-nowrap">
                          <button
                            onClick={() => startEdit(l)}
                            disabled={busy}
                            className="text-slate-400 hover:text-teal disabled:opacity-60"
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => remove(l.id)}
                            disabled={busy}
                            className="text-slate-400 hover:text-red-500 disabled:opacity-60"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                  Заявок пока нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
