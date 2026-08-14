import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "What's My ISO? | Language Code Lookup",
  description:
    "Find ISO 639 language codes, alternate names, and related identifiers for any language. Standalone tool from SILICON / IDLI.",
  openGraph: {
    title: "What's My ISO?",
    description: "Quickly look up ISO language codes and aliases.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
