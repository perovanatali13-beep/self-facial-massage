"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import type { Lesson } from "@/lib/types";

export default function LessonEditor({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState(lesson);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function uploadVideo(file: File) {
    setUploading(true);
    setProgress(0);
    try {
      const oldUrl = form.videoFile;
      const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const blob = await upload(`lessons/${form.id}-${Date.now()}.${ext}`, file, {
        access: "private",
        handleUploadUrl: "/api/admin/blob-upload",
        onUploadProgress: (e) => setProgress(Math.round(e.percentage)),
      });
      setForm((f) => ({ ...f, videoFile: blob.url }));
      if (oldUrl) {
        await fetch("/api/admin/video", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: oldUrl }),
        });
      }
    } catch (err) {
      alert("Не удалось загрузить видео: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function removeVideo() {
    if (!form.videoFile) return;
    if (!confirm("Удалить видео урока?")) return;
    const url = form.videoFile;
    setForm((f) => ({ ...f, videoFile: "" }));
    await fetch("/api/admin/video", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  }

  function cmd(command: string, value?: string) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }

  function syncContent() {
    if (editorRef.current) {
      setForm((f) => ({ ...f, content: editorRef.current!.innerHTML }));
    }
  }

  async function save() {
    setSaving(true);
    const content = editorRef.current?.innerHTML ?? form.content;
    const res = await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, content }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/course");
      router.refresh();
    } else {
      alert("Ошибка сохранения");
    }
  }

  const ToolBtn = ({
    onClick,
    children,
    title,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded px-2.5 py-1 text-sm text-slate-600 hover:bg-slate-100"
    >
      {children}
    </button>
  );

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <p className="text-xs uppercase tracking-wide text-slate-400">Курс · Урок</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">
        {lesson.id === "new" ? "Новый урок" : form.title}
      </h1>

      <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-7">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">День</label>
            <input
              type="number"
              min={1}
              value={form.day}
              onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Категория</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Дата</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Заголовок</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Краткое описание
          </label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Видео урока (файл)
          </label>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm">
              {form.videoFile ? (
                <span className="font-medium text-teal-dark">✓ Видео загружено</span>
              ) : (
                <span className="text-slate-500">Видео не загружено</span>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <label
                className={`cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 ${
                  uploading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                {uploading
                  ? `Загрузка… ${progress}%`
                  : form.videoFile
                    ? "Заменить видео"
                    : "Загрузить видео"}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadVideo(file);
                    e.target.value = "";
                  }}
                />
              </label>
              {form.videoFile && !uploading && (
                <button
                  type="button"
                  onClick={removeVideo}
                  className="text-sm text-slate-400 hover:text-red-500"
                >
                  Удалить видео
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Файл загружается в защищённое хранилище и недоступен для скачивания.
              Изменения вступят в силу после сохранения урока.
            </p>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Или ссылка на внешнее видео (embed URL)
          </label>
          <input
            value={form.videoUrl}
            placeholder="https://www.youtube.com/embed/..."
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Содержимое</label>
          <div className="overflow-hidden rounded-lg border border-slate-300">
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
              <ToolBtn title="Заголовок 2" onClick={() => cmd("formatBlock", "<h2>")}>
                H2
              </ToolBtn>
              <ToolBtn title="Заголовок 3" onClick={() => cmd("formatBlock", "<h3>")}>
                H3
              </ToolBtn>
              <ToolBtn title="Абзац" onClick={() => cmd("formatBlock", "<p>")}>
                ¶
              </ToolBtn>
              <span className="mx-1 h-5 w-px bg-slate-300" />
              <ToolBtn title="Жирный" onClick={() => cmd("bold")}>
                <b>B</b>
              </ToolBtn>
              <ToolBtn title="Курсив" onClick={() => cmd("italic")}>
                <i>I</i>
              </ToolBtn>
              <ToolBtn title="Подчёркнутый" onClick={() => cmd("underline")}>
                <u>U</u>
              </ToolBtn>
              <span className="mx-1 h-5 w-px bg-slate-300" />
              <ToolBtn title="Список" onClick={() => cmd("insertUnorderedList")}>
                • Список
              </ToolBtn>
              <ToolBtn title="Нумерованный" onClick={() => cmd("insertOrderedList")}>
                1. Список
              </ToolBtn>
              <ToolBtn
                title="Ссылка"
                onClick={() => {
                  const url = prompt("URL ссылки:");
                  if (url) cmd("createLink", url);
                }}
              >
                🔗
              </ToolBtn>
            </div>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={syncContent}
              className="prose-course min-h-[240px] px-4 py-3 text-sm outline-none"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="h-4 w-4 accent-teal"
          />
          Опубликовать урок
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => router.push("/admin/course")}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Отмена
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-teal px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-dark disabled:opacity-60"
        >
          {saving ? "Сохранение…" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}
