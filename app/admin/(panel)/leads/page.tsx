import { getLeads } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Заявки на курс</h1>
      <p className="mt-1 text-sm text-slate-500">
        Обращения с формы покупки на лендинге.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-6 py-4 font-medium">Имя</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Телефон</th>
              <th className="px-6 py-4 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-slate-100 last:border-0">
                <td className="px-6 py-4 font-medium text-slate-800">{l.name}</td>
                <td className="px-6 py-4 text-slate-500">{l.email}</td>
                <td className="px-6 py-4 text-slate-500">{l.phone}</td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(l.createdAt).toLocaleString("ru-RU")}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                  Заявок пока нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
