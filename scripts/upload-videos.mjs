import { put } from "@vercel/blob";
import { createClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import path from "path";

const SRC = "C:/Users/class/Desktop/Для сайтов/самомассаж";
const FILES = {
  1: "День 1.mp4",
  2: "День 2.MOV",
  3: "День 3.MOV",
  4: "День 4.MOV",
  5: "День 5.MOV",
  6: "День 6.MOV",
  7: "День 7.MOV",
};

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("BLOB_READ_WRITE_TOKEN не задан");
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  auth: { persistSession: false },
});

const uploaded = {};
for (const [day, name] of Object.entries(FILES)) {
  const buf = await readFile(path.join(SRC, name));
  const sizeMb = (buf.length / 1024 / 1024).toFixed(1);
  process.stdout.write(`Загружаю день ${day} (${sizeMb} МБ)… `);
  const blob = await put(`lessons/day-${day}.mp4`, buf, {
    access: "private",
    contentType: "video/mp4",
    allowOverwrite: true,
    token,
  });
  uploaded[day] = blob.url;
  console.log("✓");
}

// Записываем ссылки на видео в документ course
const { data: row, error: readErr } = await supabase
  .from("documents")
  .select("data")
  .eq("id", "course")
  .single();
if (readErr) {
  console.error("Не удалось прочитать course:", readErr.message);
  process.exit(1);
}
const course = row.data;
for (const lesson of course.lessons) {
  if (uploaded[lesson.day]) lesson.videoFile = uploaded[lesson.day];
}
const { error: writeErr } = await supabase
  .from("documents")
  .update({ data: course, updated_at: new Date().toISOString() })
  .eq("id", "course");
if (writeErr) {
  console.error("Не удалось обновить course:", writeErr.message);
  process.exit(1);
}
console.log("Готово: видео загружены в Vercel Blob и привязаны к урокам.");
