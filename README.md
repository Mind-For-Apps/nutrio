# Nutrio — анкета первичной консультации

Веб-приложение на Next.js: посетитель выбирает анкету (женское / мужское здоровье),
заполняет её и отправляет. Заполненная анкета приходит письмом нутрициологу.

## Стек

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Nodemailer (отправка анкеты по SMTP)

## Структура

- `src/app/page.tsx` — главная: hero-баннер и выбор анкеты
- `src/app/anketa/female` и `src/app/anketa/male` — страницы анкет
- `src/components/QuestionnaireForm.tsx` — форма анкеты
- `src/lib/questionnaire.ts` — все вопросы (единый источник; мужской вариант —
  та же схема без блока «Женское здоровье» и вопроса про детей/роды)
- `src/app/api/submit/route.ts` — приём формы и отправка письма

## Локальный запуск

```bash
npm install
npm run dev
```

Откроется на http://localhost:3002

## Настройка отправки почты

Отправка письма работает через SMTP. Скопируйте `.env.example` в `.env.local`
и заполните значения:

```bash
cp .env.example .env.local
```

Для Gmail нужен **пароль приложения** (App Password), а не обычный пароль:
включите двухфакторную аутентификацию и создайте пароль на
https://myaccount.google.com/apppasswords

По умолчанию анкеты приходят на `anka.freedom@gmail.com` (переменная `MAIL_TO`).

## Деплой на Vercel

1. Импортируйте репозиторий на https://vercel.com/new
2. В **Project Settings → Environment Variables** добавьте те же переменные,
   что и в `.env.local` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
   `MAIL_TO`, при необходимости `MAIL_FROM`)
3. Deploy

> Порт 3002 в скриптах влияет только на локальную разработку; на Vercel
> приложение работает на их инфраструктуре.
