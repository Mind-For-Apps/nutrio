import Link from "next/link";

const anketas = [
  {
    href: "/anketa/female",
    title: "Женское здоровье",
    description: "Анкета с учётом особенностей женского организма",
  },
  {
    href: "/anketa/male",
    title: "Мужское здоровье",
    description: "Анкета с учётом особенностей мужского организма",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section
        className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-mint bg-cover bg-center px-6 py-20 text-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      >
        {/* Лёгкое затемнение фото, чтобы текст читался */}
        <div className="absolute inset-0 bg-black/15" />
        {/* Полупрозрачная подложка под текстом для гарантированной читаемости */}
        <div className="relative z-10 mx-auto max-w-2xl rounded-3xl bg-teal-deep/35 px-8 py-10 shadow-xl backdrop-blur-[2px] sm:px-12">
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl">
            Питайтесь правильно,
            <br />
            живите здорово!
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg font-medium text-white drop-shadow sm:text-xl">
            Ваш путь к здоровому образу жизни начинается здесь
          </p>
        </div>
      </section>

      {/* Выбор анкеты */}
      <section className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-24">
        <h2 className="text-center font-heading text-3xl font-bold text-teal sm:text-4xl">
          Выберите анкету
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {anketas.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-h-40 flex-col items-center justify-center rounded-2xl border-2 border-teal/70 bg-white p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:border-teal hover:bg-teal hover:shadow-lg"
            >
              <span className="font-heading text-xl font-semibold text-teal transition-colors group-hover:text-white sm:text-2xl">
                {item.title}
              </span>
              <span className="mt-2 text-sm text-slate-500 transition-colors group-hover:text-white/90">
                {item.description}
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-400">
          Данные анкеты используются только для консультации с нутрициологом
        </p>
      </section>
    </main>
  );
}
