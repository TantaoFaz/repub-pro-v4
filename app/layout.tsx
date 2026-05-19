import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Repub — Reformate para todas as plataformas",
  description:
    "Você escreve uma vez. A gente publica em todo lugar. Cole seu texto e receba versões prontas para X/Twitter, LinkedIn, Substack e Instagram.",
  keywords: [
    "repub",
    "reformatar texto",
    "redes sociais",
    "twitter thread",
    "linkedin post",
    "substack newsletter",
    "instagram caption",
    "IA",
    "automação",
  ],
  openGraph: {
    title: "Repub — Reformate para todas as plataformas",
    description:
      "Cole seu texto e receba versões prontas para X/Twitter, LinkedIn, Substack e Instagram.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
