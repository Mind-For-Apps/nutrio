import Link from "next/link";

export default function MaleAnketa() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16">
      <Link href="/" className="text-sm font-medium text-teal hover:underline">
        ← Назад к выбору
      </Link>
      <h1 className="mt-6 font-heading text-3xl font-bold text-teal">
        Мужское здоровье
      </h1>
      <p className="mt-4 text-slate-500">
        Здесь будет анкета для мужчин. Скоро добавим вопросы.
      </p>
    </main>
  );
}
