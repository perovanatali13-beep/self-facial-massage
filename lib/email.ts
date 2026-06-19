/**
 * Отправка письма через Resend. Если ключ не задан — тихо пропускаем
 * (доступ всё равно выдаётся и показывается на экране).
 */
export async function sendAccessEmail(to: string, code: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://self-facial-massage.vercel.app";
  if (!key || !from || !to) return;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#3a302b">
      <h2 style="color:#b5806b">Доступ к курсу самомассажа лица</h2>
      <p>Спасибо за покупку! Ваш персональный код доступа:</p>
      <p style="font-size:22px;font-weight:bold;letter-spacing:2px">${code}</p>
      <p>Откройте курс и введите код на странице доступа:</p>
      <p><a href="${site}/course/access" style="color:#b5806b">${site}/course/access</a></p>
      <p style="color:#6b5d54;font-size:13px">Код действует постоянно. Сохраните это письмо.</p>
    </div>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: "Ваш доступ к курсу самомассажа лица",
        html,
      }),
    });
  } catch {
    // не валим оплату из-за ошибки почты
  }
}
