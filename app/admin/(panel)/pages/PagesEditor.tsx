"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/types";

const SECTIONS = [
  { key: "hero", label: "Первый экран" },
  { key: "problems", label: "Проблемы" },
  { key: "about", label: "Об авторе" },
  { key: "contents", label: "Программа курса" },
  { key: "outcomes", label: "Результаты" },
  { key: "pricing", label: "Стоимость" },
  { key: "faq", label: "Вопросы (FAQ)" },
  { key: "contacts", label: "Контакты" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-600">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
        />
      )}
    </div>
  );
}

export default function PagesEditor({ initial }: { initial: SiteContent }) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initial);
  const [active, setActive] = useState<SectionKey>("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // generic deep update by mutating a clone
  function update(mutator: (draft: SiteContent) => void) {
    setContent((prev) => {
      const draft = structuredClone(prev);
      mutator(draft);
      return draft;
    });
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      alert("Ошибка сохранения");
    }
  }

  return (
    <div className="flex">
      {/* sub navigation */}
      <div className="w-56 shrink-0 border-r border-slate-200 bg-white px-3 py-6">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Лендинг
        </p>
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`mb-1 block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
              active === s.key
                ? "bg-teal-light/60 font-medium text-teal-dark"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* editor */}
      <div className="flex-1 px-8 py-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-slate-400">Страницы</p>
          <h1 className="text-2xl font-bold text-slate-900">
            {SECTIONS.find((s) => s.key === active)?.label}
          </h1>
        </div>

        <div className="max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-7">
          {active === "hero" && (
            <>
              <Field label="Бейдж" value={content.hero.badge} onChange={(v) => update((d) => { d.hero.badge = v; })} />
              <Field label="Заголовок" value={content.hero.title} onChange={(v) => update((d) => { d.hero.title = v; })} />
              <Field label="Подзаголовок" textarea value={content.hero.subtitle} onChange={(v) => update((d) => { d.hero.subtitle = v; })} />
              <Field label="Текст кнопки" value={content.hero.ctaText} onChange={(v) => update((d) => { d.hero.ctaText = v; })} />
              <Field label="Эмодзи/символ" value={content.hero.imageEmoji} onChange={(v) => update((d) => { d.hero.imageEmoji = v; })} />
            </>
          )}

          {active === "problems" && (
            <>
              <Field label="Заголовок секции" value={content.problems.title} onChange={(v) => update((d) => { d.problems.title = v; })} />
              <ListEditor
                items={content.problems.items}
                onAdd={() => update((d) => { d.problems.items.push({ title: "", text: "" }); })}
                onRemove={(i) => update((d) => { d.problems.items.splice(i, 1); })}
                render={(item, i) => (
                  <>
                    <Field label="Заголовок" value={item.title} onChange={(v) => update((d) => { d.problems.items[i].title = v; })} />
                    <Field label="Текст" textarea value={item.text} onChange={(v) => update((d) => { d.problems.items[i].text = v; })} />
                  </>
                )}
              />
            </>
          )}

          {active === "about" && (
            <>
              <Field label="Имя" value={content.about.name} onChange={(v) => update((d) => { d.about.name = v; })} />
              <Field label="Роль" value={content.about.role} onChange={(v) => update((d) => { d.about.role = v; })} />
              <Field label="Описание" textarea value={content.about.text} onChange={(v) => update((d) => { d.about.text = v; })} />
              <Field label="Эмодзи/символ" value={content.about.imageEmoji} onChange={(v) => update((d) => { d.about.imageEmoji = v; })} />
              <StringListEditor
                label="Регалии"
                items={content.about.credentials}
                onChange={(items) => update((d) => { d.about.credentials = items; })}
              />
            </>
          )}

          {active === "contents" && (
            <>
              <Field label="Заголовок секции" value={content.contents.title} onChange={(v) => update((d) => { d.contents.title = v; })} />
              <ListEditor
                items={content.contents.items}
                onAdd={() => update((d) => { d.contents.items.push({ title: "", text: "" }); })}
                onRemove={(i) => update((d) => { d.contents.items.splice(i, 1); })}
                render={(item, i) => (
                  <>
                    <Field label="Заголовок" value={item.title} onChange={(v) => update((d) => { d.contents.items[i].title = v; })} />
                    <Field label="Текст" textarea value={item.text} onChange={(v) => update((d) => { d.contents.items[i].text = v; })} />
                  </>
                )}
              />
            </>
          )}

          {active === "outcomes" && (
            <>
              <Field label="Заголовок секции" value={content.outcomes.title} onChange={(v) => update((d) => { d.outcomes.title = v; })} />
              <StringListEditor
                label="Пункты"
                items={content.outcomes.items}
                onChange={(items) => update((d) => { d.outcomes.items = items; })}
              />
            </>
          )}

          {active === "pricing" && (
            <>
              <Field label="Заголовок секции" value={content.pricing.title} onChange={(v) => update((d) => { d.pricing.title = v; })} />
              <Field label="Цена" value={content.pricing.price} onChange={(v) => update((d) => { d.pricing.price = v; })} />
              <Field label="Текст кнопки" value={content.pricing.ctaText} onChange={(v) => update((d) => { d.pricing.ctaText = v; })} />
              <StringListEditor
                label="Что входит"
                items={content.pricing.features}
                onChange={(items) => update((d) => { d.pricing.features = items; })}
              />
            </>
          )}

          {active === "faq" && (
            <>
              <Field label="Заголовок секции" value={content.faq.title} onChange={(v) => update((d) => { d.faq.title = v; })} />
              <ListEditor
                items={content.faq.items}
                onAdd={() => update((d) => { d.faq.items.push({ q: "", a: "" }); })}
                onRemove={(i) => update((d) => { d.faq.items.splice(i, 1); })}
                render={(item, i) => (
                  <>
                    <Field label="Вопрос" value={item.q} onChange={(v) => update((d) => { d.faq.items[i].q = v; })} />
                    <Field label="Ответ" textarea value={item.a} onChange={(v) => update((d) => { d.faq.items[i].a = v; })} />
                  </>
                )}
              />
            </>
          )}

          {active === "contacts" && (
            <>
              <Field label="Телефон" value={content.contacts.phone} onChange={(v) => update((d) => { d.contacts.phone = v; })} />
              <Field label="Email" value={content.contacts.email} onChange={(v) => update((d) => { d.contacts.email = v; })} />
              <Field label="Telegram" value={content.contacts.telegram} onChange={(v) => update((d) => { d.contacts.telegram = v; })} />
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {saved && <span className="text-sm text-teal">Сохранено ✓</span>}
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-teal px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-dark disabled:opacity-60"
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ListEditor<T>({
  items,
  render,
  onAdd,
  onRemove,
}: {
  items: T[];
  render: (item: T, i: number) => React.ReactNode;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">#{i + 1}</span>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-xs text-slate-400 hover:text-red-500"
            >
              Удалить
            </button>
          </div>
          {render(item, i)}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-500 hover:border-teal hover:text-teal"
      >
        + Добавить
      </button>
    </div>
  );
}

function StringListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-600">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="rounded-lg px-3 text-slate-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-500 hover:border-teal hover:text-teal"
        >
          + Добавить пункт
        </button>
      </div>
    </div>
  );
}
