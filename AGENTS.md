# AGENTS.md

Руководство для ИИ-агентов и разработчиков по проекту **self-facial-massage** —
сайт курса по самомассажу лица: лендинг, страница курса и админ-панель.

## Стек

- **Next.js 15** (App Router, Server Components, Server Actions, Route Handlers)
- **React 19**, **TypeScript**
- **Tailwind CSS v4** (через `@tailwindcss/postcss`, тема в `app/globals.css`)
- **Supabase** — хранение всех данных (Postgres)
- Хостинг — **Vercel**, домен `https://self-facial-massage.vercel.app`

## Команды

```bash
npm run dev      # локальная разработка → http://localhost:3000
npm run build    # прод-сборка (проверка типов)
npm run start    # запуск прод-сборки
npm run lint     # ESLint
npm run seed     # залить data/*.json в Supabase (node --env-file=.env.local)
vercel deploy --prod   # ручной деплой (обычно не нужен — см. ниже)
```

## Структура

```
app/
  (public)/                 — публичный сайт (route group, без префикса в URL)
    page.tsx                — лендинг (/)
    course/page.tsx         — список уроков (/course)
    course/[id]/page.tsx    — страница урока (/course/<id>)
    components/             — SiteHeader, SiteFooter, BuyForm (форма заявки)
  admin/
    login/page.tsx          — вход (вне guarded-группы)
    actions.ts              — server actions login/logout
    (panel)/                — защищённая часть (guard в layout.tsx)
      layout.tsx            — проверка сессии + Sidebar
      page.tsx              — дашборд
      course/               — список уроков, тоггл публикации, редактор урока
      pages/                — редактор секций лендинга (PagesEditor)
      leads/                — заявки с формы
      users/                — пользователи админки
      components/Sidebar.tsx
  api/
    leads/route.ts          — приём заявок (публичный POST)
    admin/{content,lessons,users}/route.ts — мутации (требуют авторизации)
lib/
  types.ts                  — типы данных (SiteContent, Lesson, User, Lead)
  data.ts                   — доступ к данным (документы в Supabase)
  supabase.ts               — ленивый серверный клиент Supabase
  auth.ts                   — cookie-сессия (HMAC), проверка логина
data/                       — исходные JSON для первичного заполнения (seed)
scripts/seed.mjs            — скрипт заполнения БД
public/facealarm-mockup.png — изображение приложения FaceAlarm
```

## Модель данных (Supabase)

Проект Supabase: **self-facial-massage** (ref `gelteazugpuasempepyc`).
Одна таблица `public.documents`:

| колонка     | тип         |
|-------------|-------------|
| `id`        | text PK     |
| `data`      | jsonb       |
| `updated_at`| timestamptz |

Документы по `id`: **`content`** (секции лендинга), **`course`** (`{ intro, lessons[] }`),
**`users`** (массив), **`leads`** (массив). `lib/data.ts` читает/пишет документ целиком —
сигнатуры функций совпадают с прежней файловой версией (`getContent`, `saveContent`,
`getCourse`, `upsertLesson`, `getLeads`, `addLead` и т.д.).

> **БД — источник правды в рантайме.** Файлы в `data/` нужны только для `npm run seed`.
> Редактирование документов `content`/`course` напрямую в Supabase применяется на сайте
> **мгновенно**, без передеплоя (все публичные страницы — `dynamic = "force-dynamic"`).

## Авторизация

- Сессия — httpOnly-cookie `sfm_session`, значение = `HMAC-SHA256(login:password, AUTH_SECRET)`.
- Логин/пароль и секрет — переменные окружения (см. ниже). Логика в `lib/auth.ts`.
- Все страницы `app/admin/(panel)/**` защищены в `layout.tsx` через `isAuthenticated()`
  (редирект на `/admin/login`). Все мутирующие API проверяют `isAuthenticated()` и
  возвращают `401` без сессии.

## Переменные окружения

Локально — `.env.local` (в git не коммитится), в проде — настройки проекта на Vercel.

```
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_KEY=...           # ключ Supabase, ТОЛЬКО на сервере (без NEXT_PUBLIC_)
ADMIN_LOGIN=admin
ADMIN_PASSWORD=...
AUTH_SECRET=<длинная случайная строка>
BLOB_READ_WRITE_TOKEN=...   # токен приватного Vercel Blob-стора (видео уроков)
```

Никогда не коммитьте ключи и не используйте `NEXT_PUBLIC_` для `SUPABASE_KEY` —
весь доступ к БД идёт только через сервер.

## Деплой

Репозиторий GitHub `perovanatali13-beep/self-facial-massage` подключён к Vercel:
**каждый `git push` в `main` автоматически разворачивает прод**. Ручной деплой —
`vercel deploy --prod`.

## Соглашения и важные нюансы

- **Язык интерфейса — русский.** Весь текст для пользователя пишите по-русски.
- **Публичные страницы тянут данные из БД** и помечены `export const dynamic = "force-dynamic"`.
- **Добавление новой секции лендинга** требует синхронных правок в 4–5 местах:
  1. тип в `lib/types.ts` (`SiteContent`);
  2. рендер в `app/(public)/page.tsx`;
  3. форма в `app/admin/(panel)/pages/PagesEditor.tsx` (массив `SECTIONS` + блок формы);
  4. сид в `data/content.json`;
  5. **обновить живой документ `content` в Supabase** (jsonb merge/`jsonb_set`), иначе
     на сайте поля будут отсутствовать. Рендер новых секций по возможности оборачивайте
     в проверку (`{c.section && ...}`), чтобы не падать при отсутствии данных.
- **Уроки курса** редактируются через админку (`/admin/course`); редактор содержимого —
  contentEditable с `document.execCommand`, HTML сохраняется в поле `content` урока и
  выводится через `dangerouslySetInnerHTML` с классом `.prose-course` (стили в `globals.css`).
- **Видео уроков (Vercel Blob, приватный стор):** файлы лежат в приватном Blob-сторе
  `self-facial-massage-videos`, ссылка хранится в поле `videoFile` урока. Отдаются через
  прокси `app/api/video/[id]/route.ts`: сервер тянет приватный файл с
  `BLOB_READ_WRITE_TOKEN`, прокидывает `Range` (перемотка) и стримит клиенту — прямой URL
  наружу не отдаётся. Плеер (`LessonVideo`) с `controlsList="nodownload"` и блокировкой
  контекстного меню. В админке загрузка идёт **client upload** (`@vercel/blob/client`
  `upload()` → токен-роут `app/api/admin/blob-upload`), т.к. серверные функции Vercel
  ограничивают тело запроса ~4.5 МБ. Удаление — `app/api/admin/video` (`del()`).
  Первичная загрузка из локальной папки — `scripts/upload-videos.mjs`. Приоритет на
  странице урока: `videoFile` (свой файл) → `videoUrl` (внешний embed) → заглушка.
  Заметка: приватный Blob не рекомендован для файлов >100 МБ при высоком трафике — здесь
  трафик низкий, поэтому ок.
- **Безопасность БД (известное ограничение):** сервер ходит в Supabase publishable-ключом,
  на `documents` стоит разрешающая RLS-политика. Ключ не публикуется (только серверный env),
  но для жёсткой защиты стоит перейти на secret/service-role ключ и закрыть доступ для anon.
- **Бесплатный тариф Supabase** усыпляет проект после ~7 дней простоя; живой трафик не даёт уснуть.
- **Windows:** предупреждения git про `LF will be replaced by CRLF` безвредны.
