import { verifyNotification } from "@/lib/payments";
import { markOrderPaid, getOrder } from "@/lib/orders";
import { sendAccessEmail } from "@/lib/email";

export const runtime = "nodejs";

/**
 * Webhook от Т-Банк. На статусе CONFIRMED помечаем заказ оплаченным,
 * выдаём код доступа и отправляем его на email. В ответ обязательно "OK".
 */
export async function POST(req: Request) {
  let params: Record<string, unknown>;
  try {
    params = await req.json();
  } catch {
    return new Response("ERROR", { status: 400 });
  }

  if (!verifyNotification(params)) {
    return new Response("ERROR", { status: 403 });
  }

  const status = String(params.Status || "");
  const orderId = String(params.OrderId || "");

  if (status === "CONFIRMED" && orderId) {
    const code = await markOrderPaid(orderId);
    if (code) {
      const order = await getOrder(orderId);
      if (order?.email) await sendAccessEmail(order.email, code);
    }
  }

  // Т-Банк ожидает тело "OK", иначе будет повторять уведомление.
  return new Response("OK");
}
