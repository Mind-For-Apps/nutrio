import type { Metadata } from "next";
import { Comfortaa, Nunito } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({
  variable: "--font-heading",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nutrio — Анкета здоровья",
  description:
    "Заполните анкету о своём здоровье для консультации с нутрициологом. Ваш путь к здоровому образу жизни начинается здесь.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${comfortaa.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-800">
        {children}
      </body>
    </html>
  );
}
