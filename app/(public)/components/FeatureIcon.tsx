// Набор лёгких линейных иконок (наследуют currentColor).
// Используются в блоках «Знакомо?» и «Что вы получите».

const PATHS: React.ReactNode[] = [
  // искра / сияние
  <path
    key="sparkle"
    d="M12 3c.4 3.7 1.3 4.6 5 5-3.7.4-4.6 1.3-5 5-.4-3.7-1.3-4.6-5-5 3.7-.4 4.6-1.3 5-5Z"
  />,
  // капля / увлажнение
  <path key="drop" d="M12 3c3 3.8 5 6.3 5 8.8a5 5 0 0 1-10 0C7 9.3 9 6.8 12 3Z" />,
  // лист / натуральность
  <>
    <path key="leaf" d="M20 4C10 4 5 9 5 18c9 0 14-5 14-14Z" />
    <path key="stem" d="M5 19C8 14 12 11 17 9" />
  </>,
  // солнце / свежесть
  <>
    <circle key="sun" cx="12" cy="12" r="4" />
    <path key="rays" d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
  </>,
  // сердце / забота
  <path
    key="heart"
    d="M12 20s-7-4.4-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.6 12 20 12 20Z"
  />,
  // лицо / улыбка
  <>
    <circle key="face" cx="12" cy="12" r="9" />
    <path key="smile" d="M8.5 14c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2" />
    <path key="eyes" d="M9 9.5h.01M15 9.5h.01" />
  </>,
  // цветок
  <>
    <circle key="center" cx="12" cy="12" r="2.2" />
    <path
      key="petals"
      d="M12 9.8c-1-2.4-4-2.4-4 .2 0 1 .8 1.8 2 2M12 14.2c1 2.4 4 2.4 4-.2 0-1-.8-1.8-2-2M9.8 12c-2.4-1-2.4-4 .2-4 1 0 1.8.8 2 2M14.2 12c2.4 1 2.4 4-.2 4-1 0-1.8-.8-2-2"
    />
  </>,
  // часы / 7 минут
  <>
    <circle key="clock" cx="12" cy="12" r="9" />
    <path key="hands" d="M12 7v5l3 2" />
  </>,
];

export default function FeatureIcon({
  index,
  className = "",
}: {
  index: number;
  className?: string;
}) {
  const node = PATHS[index % PATHS.length];
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
      {node}
    </svg>
  );
}
