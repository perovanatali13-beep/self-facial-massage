import Link from "next/link";
import type { SiteContent } from "@/lib/types";
import { glue } from "@/lib/typography";

export default function SiteFooter({ contacts }: { contacts: SiteContent["contacts"] }) {
  return (
    <footer className="mt-24 border-t border-sand bg-sand/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-espresso">
            Алина Салаватова
          </p>
          <p className="mt-2 max-w-xs text-sm text-mocha">
            {glue("Самомассаж лица — навык, который остаётся с вами на всю жизнь.")}
          </p>
        </div>
        <div className="text-sm text-mocha">
          <p className="mb-3 font-medium text-espresso">Контакты</p>
          <p>Телефон: {contacts.phone}</p>
          <p>Email: {contacts.email}</p>
          <p>Telegram: {contacts.telegram}</p>
        </div>
        <div className="text-sm text-mocha">
          <p className="mb-3 font-medium text-espresso">Навигация</p>
          <Link href="/" className="block hover:text-terracotta">Главная</Link>
          <Link href="/course" className="block hover:text-terracotta">Курс</Link>
          <Link href="/admin" className="block hover:text-terracotta">Админ-панель</Link>
        </div>
      </div>
      <div className="border-t border-sand py-5 text-center text-xs text-mocha">
        © {new Date().getFullYear()} Самомассаж лица. Все права защищены.
      </div>
    </footer>
  );
}
