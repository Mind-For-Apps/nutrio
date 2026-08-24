import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getSections, variantTitles, type Variant } from "@/lib/questionnaire";

export const runtime = "nodejs";

const MAIL_TO = process.env.MAIL_TO || "anka.freedom@gmail.com";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmail(variant: Variant, answers: Record<string, string>) {
  const sections = getSections(variant);
  const dash = "—";

  const textParts: string[] = [];
  const htmlParts: string[] = [];

  textParts.push(`АНКЕТА ПЕРВИЧНОЙ КОНСУЛЬТАЦИИ (${variantTitles[variant]})`, "");
  htmlParts.push(
    `<h1 style="font-family:Arial,sans-serif;color:#1f5d6c">Анкета первичной консультации</h1>`,
    `<p style="font-family:Arial,sans-serif;color:#5cbfae;font-weight:bold;margin-top:-8px">${escapeHtml(
      variantTitles[variant]
    )}</p>`
  );

  for (const section of sections) {
    textParts.push(`=== ${section.title} ===`);
    htmlParts.push(
      `<h2 style="font-family:Arial,sans-serif;color:#1f5d6c;border-bottom:2px solid #7dd3c4;padding-bottom:4px;margin-top:28px">${escapeHtml(
        section.title
      )}</h2>`
    );

    for (const field of section.fields) {
      const answer = (answers[field.id] ?? "").trim() || dash;
      textParts.push(`• ${field.label}`, `  ${answer}`, "");
      htmlParts.push(
        `<div style="font-family:Arial,sans-serif;margin:12px 0">` +
          `<div style="color:#334155;font-weight:bold">${escapeHtml(field.label)}</div>` +
          `<div style="color:#0f172a;white-space:pre-wrap;margin-top:2px">${escapeHtml(
            answer
          )}</div>` +
          `</div>`
      );
    }
  }

  return { text: textParts.join("\n"), html: htmlParts.join("\n") };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const { variant, answers } = (body ?? {}) as {
    variant?: Variant;
    answers?: Record<string, string>;
  };

  if (variant !== "female" && variant !== "male") {
    return NextResponse.json({ error: "Неизвестный тип анкеты" }, { status: 400 });
  }
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Нет данных анкеты" }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    console.error("SMTP credentials are not configured (SMTP_USER / SMTP_PASS).");
    return NextResponse.json(
      {
        error:
          "Отправка почты пока не настроена. Обратитесь к администратору сайта.",
      },
      { status: 500 }
    );
  }

  const host = SMTP_HOST || "smtp.gmail.com";
  const port = Number(SMTP_PORT || 465);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const { text, html } = buildEmail(variant, answers);
  const fio = (answers.fio ?? "").trim();
  const subject = `Анкета (${variantTitles[variant]})${fio ? ` — ${fio}` : ""}`;

  try {
    await transporter.sendMail({
      from: MAIL_FROM || SMTP_USER,
      to: MAIL_TO,
      replyTo: MAIL_FROM || SMTP_USER,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("Failed to send questionnaire email:", err);
    return NextResponse.json(
      { error: "Не удалось отправить письмо. Попробуйте позже." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
