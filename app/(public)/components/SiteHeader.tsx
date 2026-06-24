import Link from "next/link";
import { glue } from "@/lib/typography";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-sand/70 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-xl font-semibold text-espresso">
          Алина Салаватова<span className="text-terracotta">.</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-mocha md:flex">
          <a href="/#about" className="hover:text-terracotta">{glue("Об авторе")}</a>
          <a href="/#contents" className="hover:text-terracotta">Программа</a>
          <a href="/#faq" className="hover:text-terracotta">Вопросы</a>
        </nav>
        <a
          href="/#pricing"
          className="rounded-full bg-terracotta px-5 py-2 text-sm font-medium text-white transition hover:bg-clay"
        >
          Получить доступ
        </a>
      </div>
    </header>
  );
}
