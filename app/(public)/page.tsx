import Link from "next/link";
import Image from "next/image";
import { getContent } from "@/lib/data";
import { glue, glueDeep } from "@/lib/typography";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import BuyForm from "./components/BuyForm";
import ReviewsCarousel from "./components/ReviewsCarousel";
import FeatureIcon, { outcomeIcon } from "./components/FeatureIcon";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const c = glueDeep(await getContent());

  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-block rounded-full bg-sand px-4 py-1 text-xs font-medium uppercase tracking-wide text-terracotta">
              {c.hero.badge}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-espresso md:text-5xl">
              {c.hero.title}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-mocha">{c.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#pricing"
                className="rounded-full bg-terracotta px-7 py-3 font-medium text-white transition hover:bg-clay"
              >
                {c.hero.ctaText}
              </a>
              <Link
                href="/course"
                className="rounded-full border border-clay px-7 py-3 font-medium text-espresso transition hover:bg-sand"
              >
                Посмотреть программу
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="blob-alt absolute left-1/2 top-1/2 h-80 w-80 -translate-x-[46%] -translate-y-[46%] bg-gradient-to-br from-rose/50 via-sand to-clay/40 md:h-[26rem] md:w-[26rem]" />
            <div className="blob relative h-72 w-72 overflow-hidden shadow-xl ring-8 ring-white md:h-96 md:w-96">
              <Image
                src="/hero-woman.jpg"
                alt="Ухоженное лицо женщины после самомассажа"
                fill
                priority
                sizes="(min-width: 768px) 384px, 288px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="bg-sand/40 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center font-display text-3xl font-semibold text-espresso">
            {c.problems.title}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.problems.items.map((item, i) => (
              <div key={i} className="rounded-soft bg-white p-6 shadow-sm">
                <h3 className="font-display text-lg font-semibold text-terracotta">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-mocha">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <div className="order-2 flex justify-center md:order-1">
            <div className="relative h-72 w-72 overflow-hidden rounded-soft shadow-lg md:h-96 md:w-96">
              <Image
                src="/author.jpg"
                alt={c.about.name}
                fill
                sizes="(min-width: 768px) 384px, 288px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="text-sm font-medium uppercase tracking-wide text-terracotta">
              {glue("Об авторе")}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-espresso">
              {c.about.name}
            </h2>
            <p className="mt-1 text-mocha">{c.about.role}</p>
            <p className="mt-5 text-lg text-mocha">{c.about.text}</p>
            <ul className="mt-6 space-y-2">
              {c.about.credentials.map((cr, i) => (
                <li key={i} className="flex items-start gap-2 text-mocha">
                  <span className="mt-1 text-terracotta">✦</span>
                  {cr}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Mission statement */}
      {c.about.mission && (
        <section className="bg-terracotta/10 py-14">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <span className="font-display text-5xl leading-none text-terracotta">“</span>
            <p className="mt-2 font-display text-2xl font-medium leading-relaxed text-espresso md:text-[1.7rem]">
              {c.about.mission}
            </p>
          </div>
        </section>
      )}

      {/* Course contents */}
      <section id="contents" className="bg-sand/40 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center font-display text-3xl font-semibold text-espresso">
            {c.contents.title}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.contents.items.map((item, i) => (
              <div key={i} className="rounded-soft bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-teal-light text-base font-semibold leading-none text-teal-dark">
                  {i + 1}
                </div>
                <h3 className="font-display text-lg font-semibold text-espresso">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-mocha">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="font-display text-3xl font-semibold text-espresso">
            {c.outcomes.title}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {c.outcomes.items.map((o, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-soft bg-sand/60 px-6 py-5 text-left text-espresso"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-terracotta shadow-sm">
                  <FeatureIcon name={outcomeIcon(o)} className="h-6 w-6" />
                </span>
                <span className="font-medium">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FaceAlarm app */}
      {c.faceAlarm && (
        <section id="facealarm" className="bg-sand/40 py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-teal-light px-4 py-1 text-xs font-medium uppercase tracking-wide text-teal-dark">
                {c.faceAlarm.badge}
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold text-espresso md:text-4xl">
                {c.faceAlarm.title}
              </h2>
              <p className="mt-4 max-w-lg text-lg text-mocha">{c.faceAlarm.subtitle}</p>
              <ul className="mt-6 space-y-4">
                {c.faceAlarm.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal text-sm text-white">
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-medium text-espresso">{f.title}. </span>
                      <span className="text-mocha">{f.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                {c.faceAlarm.appStoreUrl && (
                  <a
                    href={c.faceAlarm.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-espresso px-6 py-3 text-sm font-medium text-cream transition hover:bg-mocha"
                  >
                     App Store
                  </a>
                )}
                {c.faceAlarm.googlePlayUrl && (
                  <a
                    href={c.faceAlarm.googlePlayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-espresso px-6 py-3 text-sm font-medium text-cream transition hover:bg-mocha"
                  >
                    ▶ Google Play
                  </a>
                )}
                {c.faceAlarm.siteUrl && (
                  <a
                    href={c.faceAlarm.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-clay px-6 py-3 text-sm font-medium text-espresso transition hover:bg-sand"
                  >
                    Подробнее
                  </a>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              {c.faceAlarm.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={c.faceAlarm.imageUrl}
                  alt="Приложение FaceAlarm — трекер для лица"
                  className="w-64 rounded-[2rem] shadow-xl md:w-72"
                />
              ) : (
                <div className="flex h-80 w-64 items-center justify-center rounded-[2.5rem] border-8 border-espresso bg-gradient-to-br from-teal-light via-cream to-rose/40 text-6xl shadow-xl">
                  📸
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section id="pricing" className="bg-espresso py-20 text-cream">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold">{c.pricing.title}</h2>
            <p className="mt-4 font-display text-5xl font-bold text-rose">
              {c.pricing.price}
            </p>
            <ul className="mt-6 space-y-3">
              {c.pricing.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-rose">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-soft bg-cream p-7 text-espresso shadow-xl">
            <p className="mb-4 font-display text-xl font-semibold">
              {glue("Оставьте заявку на курс")}
            </p>
            <BuyForm ctaText={c.pricing.ctaText} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-center font-display text-3xl font-semibold text-espresso">
            {c.faq.title}
          </h2>
          <div className="mt-10 space-y-3">
            {c.faq.items.map((item, i) => (
              <details
                key={i}
                className="group rounded-soft border border-sand bg-white p-5"
              >
                <summary className="cursor-pointer list-none font-medium text-espresso">
                  <span className="mr-2 text-terracotta group-open:rotate-45 inline-block transition">
                    +
                  </span>
                  {item.q}
                </summary>
                <p className="mt-3 pl-6 text-mocha">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {(c.reviews?.quote || (c.reviews?.images?.length ?? 0) > 0) && (
        <section id="reviews" className="bg-sand/40 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="mb-10 text-center font-display text-3xl font-semibold text-espresso">
              {c.reviews.title}
            </h2>
            {c.reviews.quote ? (
              <figure className="mx-auto max-w-3xl text-center">
                <span className="font-display text-5xl leading-none text-terracotta">“</span>
                <blockquote className="mt-2 font-display text-2xl font-medium leading-relaxed text-espresso md:text-[1.7rem]">
                  {c.reviews.quote}
                </blockquote>
                {c.reviews.author && (
                  <figcaption className="mt-5 text-mocha">— {c.reviews.author}</figcaption>
                )}
              </figure>
            ) : (
              <ReviewsCarousel images={c.reviews.images!} />
            )}
          </div>
        </section>
      )}

      <SiteFooter contacts={c.contacts} />
    </>
  );
}
