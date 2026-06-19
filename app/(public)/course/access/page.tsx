"use client";

import Link from "next/link";
import { useActionState } from "react";
import { courseLogin } from "../actions";

export default function CourseAccessPage() {
  const [state, formAction, pending] = useActionState(courseLogin, null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5">
      <Link href="/" className="mb-8 font-display text-xl font-semibold text-espresso">
        Алина Салаватова<span className="text-terracotta">.</span>
      </Link>

      <div className="w-full max-w-sm rounded-soft border border-sand bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-espresso">Доступ к курсу</h1>
        <p className="mt-2 text-sm text-mocha">
          Введите код доступа, который вы получили после покупки курса.
        </p>

        <form action={formAction} className="mt-6 space-y-3">
          <input
            name="code"
            type="password"
            autoFocus
            placeholder="Код доступа"
            className="w-full rounded-xl border border-sand bg-cream px-4 py-3 text-sm outline-none focus:border-terracotta"
          />
          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-terracotta px-6 py-3 font-medium text-white transition hover:bg-clay disabled:opacity-60"
          >
            {pending ? "Проверяем…" : "Войти в курс"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-mocha">
          Ещё не приобрели курс?{" "}
          <Link href="/#pricing" className="text-terracotta hover:underline">
            Купить
          </Link>
        </p>
      </div>
    </div>
  );
}
