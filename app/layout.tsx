import type { Metadata } from "next";
import {
  Anton,
  Archivo,
  Fraunces,
  Instrument_Sans,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-anton",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Rufias — Nutrición deportiva operada por IA",
  description:
    "Prototipo: tienda de nutrición deportiva para corredores operada por agentes de IA. Demo educativa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${archivo.variable} ${fraunces.variable} ${instrumentSans.variable} ${anton.variable} ${instrumentSerif.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
