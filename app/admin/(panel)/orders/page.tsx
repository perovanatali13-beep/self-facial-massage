import { getOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; cls: string }> = {
  paid: { label: "Оплачен", cls: "bg-teal-light text-teal-dark" },
  pending: { label: "Ожидает", cls: "bg-amber-100 text-amber-700" },
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Заказы</h1>
      <p className="mt-1 text-sm text-slate-500">
        Покупки курса и выданные коды доступа.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-5 py-4 font-medium">Покупатель</th>
              <th className="px-5 py-4 font-medium">Сумма</th>
              <th className="px-5 py-4 font-medium">Статус</th>
              <th className="px-5 py-4 font-medium">Код доступа</th>
              <th className="px-5 py-4 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const st = STATUS[o.status] || {
                label: o.status,
                cls: "bg-slate-100 text-slate-600",
              };
              return (
                <tr key={o.order_id} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-800">{o.name || "—"}</div>
                    <div className="text-xs text-slate-500">{o.email}</div>
                    <div className="text-xs text-slate-400">{o.phone}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {(o.amount / 100).toLocaleString("ru-RU")} ₽
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${st.cls}`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {o.access_code ? (
                      <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                        {o.access_code}
                      </code>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {new Date(o.created_at).toLocaleString("ru-RU")}
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  Заказов пока нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
