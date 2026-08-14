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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
