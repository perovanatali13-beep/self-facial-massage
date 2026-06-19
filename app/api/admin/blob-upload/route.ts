import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Выдаёт клиенту токен для прямой загрузки видео в приватный Blob-стор
 * (минуя серверный лимит размера тела запроса). Доступно только админу.
 */
export async function POST(req: Request) {
  const authed = await isAuthenticated();
  const body = (await req.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        if (!authed) throw new Error("Unauthorized");
        return {
          access: "private",
          allowedContentTypes: [
            "video/mp4",
            "video/quicktime",
            "video/webm",
            "video/x-m4v",
          ],
          maximumSizeInBytes: 600 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // ничего не делаем — ссылку сохраняет админка вместе с уроком
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
