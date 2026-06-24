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
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#42333a">
      <h2 style="color:#ad757e">Доступ к курсу самомассажа лица</h2>
      <p>Спасибо за покупку! Ваш код доступа к курсу:</p>
      <p style="font-size:22px;font-weight:bold;letter-spacing:2px">${code}</p>
      <p>Ссылка на курс:</p>
      <p><a href="${site}/course" style="color:#ad757e">${site}/course</a></p>
      <p style="color:#705e65;font-size:14px">
        Перейдите по ссылке и введите код доступа — после этого курс откроется и
        будет доступен 30 дней без повторного ввода.
      </p>
      <p style="color:#705e65;font-size:13px">Сохраните это письмо. Чек об оплате придёт отдельным сообщением.</p>
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
