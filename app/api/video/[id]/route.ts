import { getLesson } from "@/lib/data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Стримит приватное видео урока из Vercel Blob.
 * Файл хранится в приватном Blob-сторе и недоступен напрямую — мы запрашиваем
 * его на сервере с токеном и проксируем поток клиенту, прокидывая Range
 * (для перемотки). Прямая ссылка на файл наружу не отдаётся.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lesson = await getLesson(id);
  if (!lesson?.videoFile) {
    return new Response("Not found", { status: 404 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return new Response("Storage is not configured", { status: 500 });
  }

  const range = req.headers.get("range");
  const upstream = await fetch(lesson.videoFile, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(range ? { Range: range } : {}),
    },
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", "video/mp4");
  headers.set("Accept-Ranges", "bytes");
  // inline + no-store: воспроизведение в плеере, без явной выгрузки файла
  headers.set("Content-Disposition", "inline");
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  const contentRange = upstream.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);

  return new Response(upstream.body, { status: upstream.status, headers });
}
