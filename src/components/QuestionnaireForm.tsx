"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  getSections,
  introText,
  variantTitles,
  type Field,
  type Variant,
} from "@/lib/questionnaire";

type Status = "idle" | "submitting" | "success" | "error";

function FieldControl({ field }: { field: Field }) {
  const base =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:border-teal focus:ring-2 focus:ring-mint/40";

  if (field.type === "text") {
    return (
      <input
        type="text"
        name={field.id}
        required={field.required}
        className={base}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        name={field.id}
        required={field.required}
        rows={3}
        className={`${base} resize-y`}
      />
    );
  }

  if (field.type === "radio") {
    return (
      <div className="flex flex-col gap-2">
        {field.options?.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-slate-700">
            <input
              type="radio"
              name={field.id}
              value={opt}
              className="h-4 w-4 accent-teal"
            />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  // checkbox
  return (
    <div className="flex flex-col gap-2">
      {field.options?.map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-slate-700">
          <input
            type="checkbox"
            name={field.id}
            value={opt}
            className="h-4 w-4 accent-teal"
          />
          {opt}
        </label>
      ))}
      {field.allowOther && (
        <label className="mt-1 flex items-center gap-2 text-slate-700">
          <span className="text-slate-500">Другое:</span>
          <input
            type="text"
            name={`${field.id}__other`}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 outline-none focus:border-teal focus:ring-2 focus:ring-mint/40"
          />
        </label>
      )}
    </div>
  );
}

export default function QuestionnaireForm({ variant }: { variant: Variant }) {
  const sections = useMemo(() => getSections(variant), [variant]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const answers: Record<string, string> = {};

    for (const section of sections) {
      for (const field of section.fields) {
        if (field.type === "checkbox") {
          const values = fd.getAll(field.id).map(String).filter(Boolean);
          const other = String(fd.get(`${field.id}__other`) ?? "").trim();
          if (other) values.push(other);
          if (values.length) answers[field.id] = values.join(", ");
        } else {
          const value = String(fd.get(field.id) ?? "").trim();
          if (value) answers[field.id] = value;
        }
      }
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant, answers }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Не удалось отправить анкету");
      }
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint text-3xl text-white">
          ✓
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-teal">
          Спасибо! Анкета отправлена
        </h1>
        <p className="mt-3 text-slate-600">
          Ваши ответы переданы нутрициологу. Мы свяжемся с вами для дальнейшей
          консультации.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-teal px-6 py-2.5 font-medium text-white transition hover:bg-teal-deep"
        >
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <Link href="/" className="text-sm font-medium text-teal hover:underline">
        ← Назад к выбору
      </Link>

      <header className="mt-6">
        <p className="font-heading text-sm font-semibold uppercase tracking-wide text-mint-dark">
          {variantTitles[variant]}
        </p>
        <h1 className="mt-1 font-heading text-3xl font-bold text-teal sm:text-4xl">
          {introText.title}
        </h1>
        <div className="mt-4 space-y-3 text-slate-600">
          {introText.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8" noValidate={false}>
        {sections.map((section) => (
          <section
            key={section.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="font-heading text-xl font-bold text-teal">
              {section.title}
            </h2>
            {section.intro && (
              <p className="mt-2 text-sm text-slate-500">{section.intro}</p>
            )}

            <div className="mt-6 space-y-6">
              {section.fields.map((field) => (
                <div key={field.id}>
                  <label className="mb-2 block font-medium text-slate-700">
                    {field.label}
                    {field.required && <span className="ml-1 text-rose-500">*</span>}
                  </label>
                  <FieldControl field={field} />
                </div>
              ))}
            </div>
          </section>
        ))}

        {status === "error" && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-full bg-teal px-8 py-3.5 text-lg font-semibold text-white transition hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {status === "submitting" ? "Отправляем…" : "Отправить анкету"}
          </button>
          <p className="text-center text-xs text-slate-400">
            Отправляя анкету, вы соглашаетесь на обработку указанных данных для
            консультации с нутрициологом.
          </p>
        </div>
      </form>
    </div>
  );
}
