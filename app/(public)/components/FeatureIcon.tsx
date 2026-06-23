// Набор лёгких линейных иконок (наследуют currentColor).
// Используется в блоке «Что вы получите» — иконка подбирается по смыслу текста.

export type IconName =
  | "hands"
  | "book"
  | "unlock"
  | "sparkle"
  | "face"
  | "heart"
  | "check";

const ICONS: Record<IconName, React.ReactNode> = {
  // уход за собой руками
  hands: (
    <>
      <path d="M9.5 13V6.5a1.3 1.3 0 0 1 2.6 0V12" />
      <path d="M12.1 11.5V5.6a1.3 1.3 0 0 1 2.6 0V12" />
      <path d="M14.7 11.8V7.4a1.3 1.3 0 0 1 2.6 0V14c0 3-2 5.5-5 5.5-2 0-3.2-.8-4.4-2.3l-2.6-3.3a1.3 1.3 0 0 1 2-1.6l1.2 1.3" />
    </>
  ),
  // знание о коже
  book: (
    <>
      <path d="M5 5.5C5 4.7 5.7 4 6.5 4H18a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6.5C5.7 19 5 18.3 5 17.5Z" />
      <path d="M5 17.5C5 16.7 5.7 16 6.5 16H19" />
      <path d="M9.5 8h6M9.5 11h4" />
    </>
  ),
  // свобода от процедур и мастеров
  unlock: (
    <>
      <rect x="5.5" y="11" width="13" height="9" rx="2" />
      <path d="M8.5 11V8a3.5 3.5 0 0 1 6.8-1.2" />
      <path d="M12 14.5v2" />
    </>
  ),
  // видимый результат / сияние
  sparkle: (
    <path d="M12 3c.4 3.7 1.3 4.6 5 5-3.7.4-4.6 1.3-5 5-.4-3.7-1.3-4.6-5-5 3.7-.4 4.6-1.3 5-5Z" />
  ),
  // лицо / уверенность
  face: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2" />
      <path d="M9 9.5h.01M15 9.5h.01" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.4-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.6 12 20 12 20Z" />
  ),
  check: <path d="M5 12.5 10 17.5 19 7" />,
};

/** Подбор иконки по ключевым словам в тексте пункта. */
export function outcomeIcon(text: string): IconName {
  const t = text.toLowerCase();
  if (/уход|навык|массаж|самостоят|техник/.test(t)) return "hands";
  if (/знани|кож|потреб|понима|тип/.test(t)) return "book";
  if (/свобод|процедур|мастер|салон|без /.test(t)) return "unlock";
  if (/результат|тонус|отёк|отек|мышц|молод|свеж|сияни|упруг/.test(t)) return "sparkle";
  if (/увер|настроен|радост|удоволь/.test(t)) return "face";
  return "check";
}

export default function FeatureIcon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}
