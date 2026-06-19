import crypto from "crypto";
import { getSupabase } from "./supabase";

export interface Order {
  order_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  amount: number;
  status: string;
  access_code: string | null;
  payment_id: string | null;
  created_at: string;
  paid_at: string | null;
}

function genCode(): string {
  const raw = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `SFM-${raw.slice(0, 4)}-${raw.slice(4)}`;
}

export async function createOrder(o: {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
}): Promise<void> {
  const { error } = await getSupabase().from("orders").insert({
    order_id: o.orderId,
    name: o.name,
    email: o.email,
    phone: o.phone,
    amount: o.amount,
    status: "pending",
  });
  if (error) throw new Error(error.message);
}

export async function getOrders(): Promise<Order[]> {
  const { data } = await getSupabase()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Order[]) ?? [];
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const { data } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();
  return (data as Order) ?? null;
}

export async function setOrderPaymentId(orderId: string, paymentId: string): Promise<void> {
  await getSupabase().from("orders").update({ payment_id: paymentId }).eq("order_id", orderId);
}

/**
 * Помечает заказ оплаченным и выдаёт код доступа (идемпотентно).
 * Возвращает код доступа.
 */
export async function markOrderPaid(orderId: string): Promise<string | null> {
  const order = await getOrder(orderId);
  if (!order) return null;
  if (order.status === "paid" && order.access_code) return order.access_code;

  const code = order.access_code || genCode();
  const { error } = await getSupabase()
    .from("orders")
    .update({ status: "paid", access_code: code, paid_at: new Date().toISOString() })
    .eq("order_id", orderId);
  if (error) throw new Error(error.message);
  return code;
}

/** Действителен ли код доступа (есть оплаченный заказ с таким кодом). */
export async function verifyAccessCode(code: string): Promise<boolean> {
  if (!code) return false;
  const { data } = await getSupabase()
    .from("orders")
    .select("order_id")
    .eq("access_code", code)
    .eq("status", "paid")
    .maybeSingle();
  return Boolean(data);
}
