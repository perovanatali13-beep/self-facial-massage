import { NextResponse } from "next/server";
import { addLead } from "@/lib/data";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }
    await addLead({
      id: crypto.randomUUID(),
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone).slice(0, 50),
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
