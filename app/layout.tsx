import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Самомассаж лица — экспресс-курс Алины Салаватовой",
  description:
    "7-дневный экспресс-курс по самомассажу лица. Упругость, свежесть и тонус без салонов и мастеров.",
  verification: {
    google: "kmnXuzNiP3ry0lN-eQRtd1RqoEwjrOZn2MNtuGdUfIU",
  },
};

// Yandex.Metrika counter (id 110096367)
const YANDEX_METRIKA = `
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=110096367', 'ym');

    ym(110096367, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        {/* Yandex.Metrika counter */}
        <script dangerouslySetInnerHTML={{ __html: YANDEX_METRIKA }} />
        {/* /Yandex.Metrika counter */}
      </head>
      <body>
        {children}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/110096367"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
