import Link from "next/link";
import { getOrder, markOrderPaid } from "@/lib/orders";
import { getState } from "@/lib/payments";
import { sendAccessEmail } from "@/lib/email";
import { enterCourse } from "../actions";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  let code: string | null = null;
  let paid = false;

  if (orderId) {
    let order = await getOrder(orderId);
    // если webhook ещё не пришёл — подтверждаем статус напрямую у Т-Банк
    if (order && order.status !== "paid" && order.payment_id) {
      const state = await getState(order.payment_id);
      if (state.Status === "CONFIRMED") {
        await markOrderPaid(orderId);
        order = await getOrder(orderId);
        if (order?.email && order.access_code) {
          await sendAccessEmail(order.email, order.access_code);
        }
      }
    }
    if (order?.status === "paid" && order.access_code) {
      paid = true;
      code = order.access_code;
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-16 text-center">
      <Link href="/" className="mb-8 font-display text-xl font-semibold text-espresso">
        Алина Салаватова<span className="text-terracotta">.</span>
      </Link>

      <div className="w-full max-w-md rounded-soft border border-sand bg-white p-8 shadow-sm">
        {paid ? (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-light text-2xl text-teal-dark">
              ✓
            </div>
            <h1 className="font-display text-2xl font-semibold text-espresso">
              Оплата прошла успешно
            </h1>
            <p className="mt-3 text-mocha">Ваш персональный код доступа к курсу:</p>
            <p className="mt-3 rounded-xl bg-sand px-4 py-3 font-display text-2xl font-bold tracking-widest text-espresso">
              {code}
            </p>
            <p className="mt-3 text-sm text-mocha">
              Мы также отправили код на вашу почту. Сохраните его.
            </p>
            <form action={enterCourse} className="mt-6">
              <button className="w-full rounded-full bg-terracotta px-6 py-3 font-medium text-white transition hover:bg-clay">
                Открыть курс
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-espresso">
              Подтверждаем оплату…
            </h1>
            <p className="mt-3 text-mocha">
              Если оплата прошла, доступ появится в течение минуты. Обновите страницу
              или проверьте письмо с кодом доступа.
            </p>
            <Link
              href="/course/access"
              className="mt-6 inline-block rounded-full border border-clay px-6 py-3 font-medium text-espresso transition hover:bg-sand"
            >
              Ввести код доступа
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
