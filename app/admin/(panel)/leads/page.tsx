import { getLeads } from "@/lib/data";
import LeadsManager from "./LeadsManager";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = (await getLeads()) ?? [];
  return <LeadsManager initial={leads} />;
}
