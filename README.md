# Самомассаж лица — сайт курса

Сайт на **Next.js 15 (App Router)** + **Tailwind CSS v4** с лендингом, страницей курса и админ-панелью. Данные хранятся в **Supabase**.

**Live:** https://self-facial-massage.vercel.app
**Админка:** https://self-facial-massage.vercel.app/admin

## Структура

| Раздел | Путь | Описание |
|--------|------|----------|
| Лендинг | `/` | Посадочная страница курса (по мотивам Tilda-лендинга) |
| Курс | `/course` | Список уроков по дням |
| Урок | `/course/[id]` | Страница отдельного урока с видео и текстом |
| Админка | `/admin` | Дашборд (требует входа) |
| → Курс | `/admin/course` | Список уроков, публикация, добавление/редактирование |
| → Страницы | `/admin/pages` | Редактор всех секций лендинга |
| → Заявки | `/admin/leads` | Заявки с формы покупки |
| → Пользователи | `/admin/users` | Управление пользователями |

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
```

Сборка прод-версии:

```bash
npm run build && npm start
```

## Вход в админку

Откройте `/admin` → форма входа.

- Логин по умолчанию: **admin**
- Пароль по умолчанию: **admin**

Переопределяются переменными окружения (создайте `.env.local`):

```
ADMIN_LOGIN=ваш_логин
ADMIN_PASSWORD=надёжный_пароль
AUTH_SECRET=случайная_строка_для_подписи_сессии
```

## Хранение данных (Supabase)

Контент хранится в Supabase (проект **self-facial-massage**) в таблице
`public.documents` — по одному JSON-документу на ключ:

- `content` — секции лендинга
- `course` — уроки курса
- `users` — пользователи админки
- `leads` — заявки с формы

Весь доступ к БД идёт через сервер (Server Components и Route Handlers),
защищённый собственной авторизацией админки. Интерфейс — `lib/data.ts`.

Файлы в папке `data/` остаются как исходные данные для первичного заполнения:

```bash
npm run seed   # читает data/*.json и загружает в Supabase
```

### Переменные окружения

Локально — `.env.local`, в проде — настройки проекта на Vercel:

```
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_KEY=sb_publishable_...   # publishable-ключ Supabase (только на сервере)
ADMIN_LOGIN=admin
ADMIN_PASSWORD=...
AUTH_SECRET=<длинная случайная строка>
```

## Деплой

Проект подключён к Vercel и к репозиторию GitHub — каждый `git push` в `main`
автоматически разворачивает новую версию. Ручной деплой:

```bash
vercel deploy --prod
```

## Технологии

- Next.js 15 App Router (Server Components, Server Actions, Route Handlers)
- Tailwind CSS v4
- Сессия на cookie с HMAC-подписью (`lib/auth.ts`)
- Встроенный rich-text редактор уроков (без внешних зависимостей)
