import crypto from "crypto";

const TERMINAL = process.env.TINKOFF_TERMINAL_KEY;
const PASSWORD = process.env.TINKOFF_PASSWORD;
const API = "https://securepay.tinkoff.ru/v2";

export function paymentsConfigured(): boolean {
  return Boolean(TERMINAL && PASSWORD);
}

/**
 * Подпись запроса по правилам Т-Банк (Tinkoff) Acquiring API:
 * берём корневые скалярные поля, добавляем Password, сортируем по ключу,
 * конкатенируем значения и считаем SHA-256.
 */
function sign(params: Record<string, unknown>): string {
  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "object") continue; // исключаем Receipt, DATA и т.п.
    if (k === "Token") continue;
    data[k] = typeof v === "boolean" ? (v ? "true" : "false") : String(v);
  }
  data.Password = PASSWORD || "";
  const concat = Object.keys(data)
    .sort()
    .map((k) => data[k])
    .join("");
  return crypto.createHash("sha256").update(concat).digest("hex");
}

export interface InitResult {
  Success: boolean;
  Status?: string;
  PaymentId?: string;
  PaymentURL?: string;
  Message?: string;
  Details?: string;
}

export async function initPayment(opts: {
  orderId: string;
  amount: number; // в копейках
  description: string;
  email: string;
  successUrl: string;
  failUrl: string;
  notificationUrl: string;
}): Promise<InitResult> {
  const body: Record<string, unknown> = {
    TerminalKey: TERMINAL,
    Amount: opts.amount,
    OrderId: opts.orderId,
    Description: opts.description,
    SuccessURL: opts.successUrl,
    FailURL: opts.failUrl,
    NotificationURL: opts.notificationUrl,
  };
  const Token = sign(body);
  const res = await fetch(`${API}/Init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, Token, DATA: { Email: opts.email } }),
  });
  return (await res.json()) as InitResult;
}

export async function getState(paymentId: string): Promise<{ Status?: string; Success?: boolean }> {
  const body: Record<string, unknown> = { TerminalKey: TERMINAL, PaymentId: paymentId };
  const Token = sign(body);
  const res = await fetch(`${API}/GetState`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, Token }),
  });
  return (await res.json()) as { Status?: string; Success?: boolean };
}

/** Проверка подписи входящего уведомления (webhook) от Т-Банк. */
export function verifyNotification(params: Record<string, unknown>): boolean {
  const received = String(params.Token || "");
  if (!received) return false;
  return sign(params) === received;
}
