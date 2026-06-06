import type { CSSProperties } from "react";

// Temas de las tres propuestas de diseño. Se aplican como variables CSS
// (style={THEMES[tema]}) y las clases Tailwind referencian var(--c-*).
export type Tema = "volt" | "lab" | "editorial";

export const THEMES: Record<Tema, CSSProperties> = {
  volt: {
    "--c-bg": "#0b0b0c",
    "--c-surface": "#151517",
    "--c-surface2": "#202024",
    "--c-line": "rgba(255,255,255,0.10)",
    "--c-text": "#f5f5f0",
    "--c-muted": "#9c9c96",
    "--c-accent": "#cdff47",
    "--c-accent2": "#a6e02a",
    "--c-onaccent": "#0b0b0c",
  } as CSSProperties,
  lab: {
    "--c-bg": "#faf8f3",
    "--c-surface": "#ffffff",
    "--c-surface2": "#f1eee5",
    "--c-line": "rgba(20,20,15,0.12)",
    "--c-text": "#14140f",
    "--c-muted": "#6e6e64",
    "--c-accent": "#1e4d36",
    "--c-accent2": "#163c2a",
    "--c-onaccent": "#faf8f3",
  } as CSSProperties,
  editorial: {
    "--c-bg": "#f3ebdd",
    "--c-surface": "#ffffff",
    "--c-surface2": "#ebe1ce",
    "--c-line": "rgba(26,23,20,0.22)",
    "--c-text": "#1a1714",
    "--c-muted": "#6b635a",
    "--c-accent": "#6b1f2a",
    "--c-accent2": "#581722",
    "--c-onaccent": "#f3ebdd",
  } as CSSProperties,
};

// Tipografía display y radios según el tema
export const displayClass = (t: Tema) =>
  t === "lab"
    ? "font-fraunces font-medium tracking-tight"
    : t === "editorial"
      ? "font-anton uppercase tracking-tight"
      : "font-archivo font-black uppercase";

export const cardClass = (t: Tema) =>
  t === "editorial" ? "rounded-none border-2" : "rounded-3xl border";

export const pillClass = (t: Tema) => (t === "editorial" ? "rounded-none" : "rounded-full");

// Contenedor estándar de TODAS las páginas: centrado tipo `container`,
// máx 1280px, con gutters laterales generosos.
export const CONTAINER = "mx-auto w-full max-w-7xl px-6 sm:px-10";

export function readTema(): Tema {
  if (typeof window === "undefined") return "volt";
  const t = new URLSearchParams(window.location.search).get("tema");
  return t === "lab" || t === "editorial" || t === "volt" ? t : "volt";
}
