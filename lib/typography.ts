/**
 * Русская типографика: убираем «висящие предлоги» — после коротких
 * предлогов, союзов и частиц ставим неразрывный пробел, чтобы они не
 * оставались в конце строки. Также неразрывный пробел перед тире.
 *
 * Применяется при рендере (не меняет данные в БД), поэтому правки в админке
 * автоматически получают корректную типографику.
 */

const NBSP = String.fromCharCode(0xa0); // неразрывный пробел U+00A0

const SHORT_WORDS = new Set([
  // однобуквенные
  "а", "и", "о", "у", "в", "к", "с", "я",
  // двухбуквенные предлоги/союзы/частицы
  "во", "на", "по", "за", "из", "от", "до", "об", "ко", "со",
  "не", "ни", "но", "да", "же", "бы", "ли", "то",
  // трёхбуквенные предлоги/союзы
  "для", "или", "без", "под", "над", "при", "про", "что", "как", "так", "чем",
]);

// Разделитель (или начало строки) + короткое слово (1–3 кир. буквы) + пробел(ы).
// \s уже включает неразрывный пробел, поэтому идущие подряд предлоги тоже ловятся.
const RE = /(^|[\s(«"'>])([А-Яа-яЁё]{1,3}) +/gu;

/** Склеивает короткие предлоги/союзы со следующим словом неразрывным пробелом. */
export function glue(text: string): string {
  if (!text) return text;
  let prev: string;
  let out = text;
  // несколько проходов — на случай идущих подряд коротких слов («и в»)
  do {
    prev = out;
    out = out.replace(RE, (m, pre: string, word: string) =>
      SHORT_WORDS.has(word.toLowerCase()) ? pre + word + NBSP : m
    );
  } while (out !== prev);
  // неразрывный пробел перед тире, чтобы оно не начинало строку
  out = out.replace(/ +([—–]) /g, NBSP + "$1 ");
  return out;
}

/** Рекурсивно применяет glue ко всем строкам в объекте/массиве (новый объект). */
export function glueDeep<T>(value: T): T {
  if (typeof value === "string") return glue(value) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => glueDeep(v)) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = glueDeep(v);
    return out as T;
  }
  return value;
}
