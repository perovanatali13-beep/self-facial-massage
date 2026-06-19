import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAuthenticated } from "@/lib/auth";
import { getUsers, saveUsers } from "@/lib/data";
import type { User } from "@/lib/types";

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, email, role } = await req.json();
  if (!name || !email) {
    return NextResponse.json({ error: "Укажите имя и email" }, { status: 400 });
  }
  const users = await getUsers();
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    role: role || "Редактор",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  users.push(user);
  await saveUsers(users);
  return NextResponse.json({ ok: true, user });
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const users = (await getUsers()).filter((u) => u.id !== id);
  await saveUsers(users);
  return NextResponse.json({ ok: true });
}
