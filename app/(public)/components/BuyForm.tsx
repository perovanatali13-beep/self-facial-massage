"use client";

import { useState } from "react";

export default function BuyForm({ ctaText }: { ctaText: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/pay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.paymentUrl) {
        // переход на страницу оплаты Т-Банк
        window.location.href = data.paymentUrl;
        return;
      }
      setStatus("error");
      setMessage(data.error || "Не удалось перейти к оплате.");
    } catch {
      setStatus("error");
      setMessage("Что-то пошло не так. Попробуйте ещё раз.");
    }
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
        {status === "loading" ? "Переходим к оплате…" : ctaText}
      </button>
      {status === "error" && (
        <p className="text-center text-sm text-red-500">{message}</p>
      )}
      <p className="text-center text-xs text-mocha">
        После оплаты вы сразу получите код доступа к курсу — на экране и на email.
      </p>
    </form>
  );
}
