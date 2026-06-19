"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
            СМ
          </span>
          <span className="text-lg font-semibold text-slate-800">Админ-панель</span>
        </div>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Логин</label>
            <input
              name="login"
              defaultValue="admin"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Пароль</label>
            <input
              name="password"
              type="password"
              placeholder="admin"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-teal py-2.5 text-sm font-medium text-white transition hover:bg-teal-dark disabled:opacity-60"
          >
            {pending ? "Вход…" : "Войти"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-400">
          По умолчанию: admin / admin
        </p>
      </div>
    </div>
  );
}
