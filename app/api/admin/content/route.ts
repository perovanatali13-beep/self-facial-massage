import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { saveContent } from "@/lib/data";
import type { SiteContent } from "@/lib/types";

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = (await req.json()) as SiteContent;
    await saveContent(data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 });
  }
}
