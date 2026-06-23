"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  QUESTIONS,
  SECTIONS,
  classify,
  RECOMMENDATIONS,
  type SectionKey,
} from "./questions";

export default function SkinTest() {
  const total = QUESTIONS.length;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const current = QUESTIONS[step];
  const section = SECTIONS.find((s) => s.key === current?.section);
  const currentSectionIndex = SECTIONS.findIndex((s) => s.key === current?.section);
  const selected = current ? answers[current.id] : undefined;
  const answeredCount = Object.keys(answers).length;
  const isLast = step === total - 1;

  function choose(points: number) {
    setAnswers((prev) => ({ ...prev, [current.id]: points }));
  }

  function next() {
    if (selected === undefined) return;
    if (isLast) {
      setFinished(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setStep((s) => s + 1);
  }

  function back() {
    if (finished) {
      setFinished(false);
      return;
    }
    if (step > 0) setStep((s) => s - 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setFinished(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const result = useMemo(() => {
    if (!finished) return null;
    const sums: Record<SectionKey, number> = {
      oily: 0,
      sensitive: 0,
      pigment: 0,
      wrinkle: 0,
    };
    for (const q of QUESTIONS) {
      const p = answers[q.id];
      if (typeof p === "number") sums[q.section] += p;
    }
    const type = classify(sums);
    return { type, info: RECOMMENDATIONS[type] };
  }, [finished, answers]);

  if (finished && result) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-12">
        <div className="rounded-soft border border-sand bg-white p-7 text-center shadow-sm">
          <span className="inline-block rounded-full bg-sand/70 px-4 py-1 text-xs font-medium uppercase tracking-wide text-terracotta">
            Ваш тип кожи
          </span>
          <p className="mt-4 font-display text-5xl font-semibold tracking-wide text-espresso">
            {result.type}
          </p>
          {result.info && (
            <p className="mx-auto mt-4 max-w-md text-mocha">{result.info.summary}</p>
          )}
        </div>

        {result.info && (
          <div className="mt-6 rounded-soft border border-sand bg-white p-7">
            <h2 className="font-display text-xl font-semibold text-espresso">
              {result.info.title}
            </h2>
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-clay">
              Рекомендованный уход
            </p>
            <ul className="mt-4 space-y-3">
              {result.info.recs.map((r) => (
                <li key={r.label} className="border-l-2 border-rose pl-4">
                  <span className="font-medium text-espresso">{r.label}: </span>
                  <span className="text-mocha">{r.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-mocha">
              Результат носит рекомендательный характер. При кожных заболеваниях
              проконсультируйтесь с дерматологом.
            </p>
          </div>
        )}

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={restart}
            className="rounded-full border border-sand bg-white px-6 py-3 text-sm font-medium text-espresso transition hover:border-terracotta"
          >
            Пройти заново
          </button>
          <Link
            href="/course"
            className="rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-white transition hover:bg-clay"
          >
            Вернуться к курсу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      {/* Таймлайн: четыре секции анкеты */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {SECTIONS.map((s, i) => {
            const filled = i <= currentSectionIndex;
            const active = i === currentSectionIndex;
            return (
              <div key={s.key}>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-terracotta transition-all duration-300"
                    style={{ width: filled ? "100%" : "0%" }}
                  />
                </div>
                <p
                  className={`mt-2 text-[11px] leading-tight sm:text-xs ${
                    active ? "font-medium text-terracotta" : "text-mocha"
                  }`}
                >
                  {s.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
        {section?.title} · Вопрос {step + 1} из {total}
      </p>

      <h2 className="mt-3 font-display text-3xl font-semibold leading-snug text-espresso md:text-4xl">
        {current.text}
      </h2>

      <div className="mt-7 space-y-3">
        {current.options.map((opt, i) => {
          const active = answeredFor(answers, current.id) && selected === opt.points;
          return (
            <button
              key={i}
              onClick={() => choose(opt.points)}
              className={`flex w-full items-center gap-3 rounded-2xl border bg-white px-5 py-4 text-left text-base transition ${
                active
                  ? "border-terracotta text-espresso shadow-sm"
                  : "border-sand text-mocha hover:border-clay"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  active ? "border-terracotta" : "border-clay"
                }`}
              >
                {active && <span className="h-2.5 w-2.5 rounded-full bg-terracotta" />}
              </span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          className="rounded-full px-5 py-2.5 text-sm font-medium text-mocha transition hover:text-terracotta disabled:opacity-40 disabled:hover:text-mocha"
        >
          ← Назад
        </button>
        <button
          onClick={next}
          disabled={selected === undefined || !answeredFor(answers, current.id)}
          className="rounded-full bg-terracotta px-7 py-3 text-sm font-medium text-white transition hover:bg-clay disabled:opacity-50"
        >
          {isLast ? "Узнать результат" : "Далее"}
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-mocha">
        Отвечено: {answeredCount} из {total}
      </p>
    </div>
  );
}

// 0 баллов — валидный ответ (бонусные вопросы), поэтому проверяем наличие ключа.
function answeredFor(answers: Record<string, number>, id: string): boolean {
  return Object.prototype.hasOwnProperty.call(answers, id);
}
