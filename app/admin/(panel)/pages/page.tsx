import { getContent } from "@/lib/data";
import PagesEditor from "./PagesEditor";

export const dynamic = "force-dynamic";

export default async function PagesAdminPage() {
  const content = await getContent();
  return <PagesEditor initial={content} />;
}
