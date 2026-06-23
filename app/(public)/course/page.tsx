import Link from "next/link";
import { redirect } from "next/navigation";
import { getCourse, getContent } from "@/lib/data";
import { glue, glueDeep } from "@/lib/typography";
import { hasCourseAccess } from "@/lib/auth";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { courseLogout } from "./actions";

export const dynamic = "force-dynamic";

export default async function CoursePage() {
  if (!(await hasCourseAccess())) redirect("/course/access");
  const course = glueDeep(await getCourse());
  const content = glueDeep(await getContent());
  const lessons = course.lessons.filter((l) => l.published);

  return (
    <>
      <SiteHeader />

      <section className="bg-sand/40 py-16">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <span className="inline-block rounded-full bg-white px-4 py-1 text-xs font-medium uppercase tracking-wide text-terracotta">
            7 дней практики
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold text-espresso md:text-5xl">
            {course.intro.title}
          </h1>
          <p className="mt-4 font-display text-xl italic text-terracotta">
            «{course.intro.tagline}»
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl space-y-4 px-5">
          <div className="rounded-soft border border-sand bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-espresso">
              {glue("Инструкция к курсу")}
            </h2>
            <p className="mt-2 text-mocha">{course.intro.instruction}</p>
          </div>

          <Link
            href="/course/test"
            className="flex items-center justify-between gap-4 rounded-soft border border-sand bg-white p-6 transition hover:border-terracotta hover:shadow-md"
          >
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-clay">
                Анкета
              </span>
              <h2 className="font-display text-lg font-semibold text-espresso">
                {glue("Определите свой тип кожи")}
              </h2>
              <p className="mt-1 text-sm text-mocha">
                {glue("Пройдите тест по Л. Бауманн и получите рекомендации по уходу.")}
              </p>
            </div>
            <span className="shrink-0 text-2xl text-terracotta">→</span>
          </Link>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-3xl space-y-4 px-5">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/course/${lesson.id}`}
              className="flex items-start gap-5 rounded-soft border border-sand bg-white p-6 transition hover:border-terracotta hover:shadow-md"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-terracotta font-display text-xl font-semibold text-white">
                {lesson.day}
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-clay">
                  {lesson.category}
                </span>
                <h3 className="font-display text-xl font-semibold text-espresso">
                  {lesson.title}
                </h3>
                <p className="mt-1 text-sm text-mocha">{lesson.description}</p>
              </div>
            </Link>
          ))}
          {lessons.length === 0 && (
            <p className="text-center text-mocha">Уроки скоро появятся.</p>
          )}

          <form action={courseLogout} className="pt-4 text-center">
            <button className="text-sm text-mocha hover:text-terracotta hover:underline">
              {glue("Выйти из курса")}
            </button>
          </form>
        </div>
      </section>

      <SiteFooter contacts={content.contacts} />
    </>
  );
}
