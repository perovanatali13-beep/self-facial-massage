"use client";

import { useState } from "react";

export default function BuyForm({ ctaText }: { ctaText: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setForm({ name: "", email: "", phone: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-soft bg-teal-light/60 p-6 text-center">
        <p className="font-display text-lg font-semibold text-teal-dark">
          Спасибо! Заявка принята ✓
        </p>
        <p className="mt-2 text-sm text-mocha">
          Мы свяжемся с вами и пришлём доступ к курсу.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        required
        placeholder="Ваше имя"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none focus:border-terracotta"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none focus:border-terracotta"
      />
      <input
        required
        placeholder="Телефон"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none focus:border-terracotta"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-terracotta px-6 py-3 font-medium text-white transition hover:bg-clay disabled:opacity-60"
      >
        {status === "loading" ? "Отправляем…" : ctaText}
      </button>
      {status === "error" && (
        <p className="text-center text-sm text-red-500">
          Что-то пошло не так. Попробуйте ещё раз.
        </p>
      )}
    </form>
  );
}
