import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteOrder } from "@/lib/orders";

export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { orderId } = await req.json();
  if (!orderId) {
    return NextResponse.json({ error: "Не указан orderId" }, { status: 400 });
  }
  await deleteOrder(String(orderId));
  return NextResponse.json({ ok: true });
}
