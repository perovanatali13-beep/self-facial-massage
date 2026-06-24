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
          <div className="mt-4 flex gap-3">
            <a
              href="https://t.me/miralinka_face"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-terracotta shadow-sm transition hover:bg-terracotta hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M21.94 4.6 18.9 19c-.23 1.02-.84 1.27-1.7.79l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.94.46l.34-4.78L18.3 6.1c.38-.34-.08-.53-.59-.19L6.92 12.9l-4.66-1.46c-1.01-.32-1.03-1.01.21-1.5L20.64 3.1c.84-.31 1.58.2 1.3 1.5Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/alina.salavatovaa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-terracotta shadow-sm transition hover:bg-terracotta hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
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
        </div>
      </div>
      <div className="border-t border-sand py-5 text-center text-xs text-mocha">
        © {new Date().getFullYear()} Самомассаж лица. Все права защищены.
      </div>
    </footer>
  );
}
