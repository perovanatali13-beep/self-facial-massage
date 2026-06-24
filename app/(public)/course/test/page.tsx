import Link from "next/link";
import { redirect } from "next/navigation";
import { getContent } from "@/lib/data";
import { glueDeep } from "@/lib/typography";
import { hasCourseAccess } from "@/lib/auth";
import SiteFooter from "../../components/SiteFooter";
import SkinTest from "./SkinTest";

export const dynamic = "force-dynamic";

export default async function SkinTestPage() {
  if (!(await hasCourseAccess())) redirect("/course/access");
  const content = glueDeep(await getContent());

  return (
    <>
      <section className="bg-sand/40 py-12">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <span className="inline-block rounded-full bg-white px-4 py-1 text-xs font-medium uppercase tracking-wide text-terracotta">
            Анкета
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold text-espresso md:text-4xl">
            Определение типа кожи по&nbsp;Л.&nbsp;Бауманн
          </h1>
          <p className="mt-3 text-mocha">
            Отвечайте честно — в конце вы получите свой тип кожи и рекомендации по&nbsp;уходу.
          </p>
          <Link
            href="/course"
            className="mt-4 inline-block text-sm text-mocha hover:text-terracotta hover:underline"
          >
            ← К урокам курса
          </Link>
        </div>
      </section>

      <SkinTest />

      <SiteFooter contacts={content.contacts} />
    </>
  );
}
