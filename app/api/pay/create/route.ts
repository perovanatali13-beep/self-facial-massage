import { NextResponse } from "next/server";
import crypto from "crypto";
import { paymentsConfigured, initPayment } from "@/lib/payments";
import { createOrder, setOrderPaymentId } from "@/lib/orders";
import { addLead } from "@/lib/data";

export const runtime = "nodejs";

const PRICE_KOPECKS = Number(process.env.COURSE_PRICE_KOPECKS || 390000); // 3900 ₽

function siteUrl(req: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(req.url).origin ||
    "https://self-facial-massage.vercel.app"
  );
}

export async function POST(req: Request) {
  if (!paymentsConfigured()) {
    return NextResponse.json(
      { error: "Приём оплаты ещё не настроен. Попробуйте позже." },
      { status: 503 }
    );
  }

  const { name, email, phone } = await req.json();
  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
  }

  const orderId = `sfm-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
  const base = siteUrl(req);

  try {
    await createOrder({ orderId, name, email, phone, amount: PRICE_KOPECKS });
    // дублируем в заявки, чтобы заказ был виден в админке
    await addLead({
      id: orderId,
      name: String(name),
      email: String(email),
      phone: String(phone),
      createdAt: new Date().toISOString(),
    });

    const result = await initPayment({
      orderId,
      amount: PRICE_KOPECKS,
      description: "Экспресс-курс по самомассажу лица",
      email: String(email),
      successUrl: `${base}/course/success?order=${orderId}`,
      failUrl: `${base}/course/fail`,
      notificationUrl: `${base}/api/pay/notify`,
    });

    if (!result.Success || !result.PaymentURL) {
      return NextResponse.json(
        { error: result.Message || result.Details || "Не удалось создать платёж" },
        { status: 502 }
      );
    }
    if (result.PaymentId) await setOrderPaymentId(orderId, result.PaymentId);

    return NextResponse.json({ paymentUrl: result.PaymentURL });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
