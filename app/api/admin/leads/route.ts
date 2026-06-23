import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { updateLead, deleteLead } from "@/lib/data";

export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, name, email, phone } = await req.json();
  if (!id || !name || !email || !phone) {
    return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
  }
  await updateLead(String(id), {
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    phone: String(phone).slice(0, 50),
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Не указан id" }, { status: 400 });
  }
  await deleteLead(String(id));
  return NextResponse.json({ ok: true });
}
