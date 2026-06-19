import Link from "next/link";

export default function FailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-16 text-center">
      <Link href="/" className="mb-8 font-display text-xl font-semibold text-espresso">
        Алина Салаватова<span className="text-terracotta">.</span>
      </Link>
      <div className="w-full max-w-md rounded-soft border border-sand bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-espresso">
          Оплата не завершена
        </h1>
        <p className="mt-3 text-mocha">
          Платёж не прошёл или был отменён. Вы можете попробовать ещё раз.
        </p>
        <Link
          href="/#pricing"
          className="mt-6 inline-block rounded-full bg-terracotta px-6 py-3 font-medium text-white transition hover:bg-clay"
        >
          Вернуться к покупке
        </Link>
      </div>
    </div>
  );
}
