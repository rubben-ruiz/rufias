"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Bot, Check, Plus, ShoppingBag } from "lucide-react";
import { CATALOG, formatMXN, type ProductCategory } from "@/lib/catalog";
import { cartCount, readCart, writeCart, type CartMap } from "@/lib/cart";
import {
  CONTAINER,
  THEMES,
  cardClass,
  displayClass,
  pillClass,
  readTema,
  type Tema,
} from "@/lib/themes";

/* Tienda: catálogo navegable. Cero consumo de IA — todo es mock. */

const CATEGORIES: Array<ProductCategory | "todos"> = [
  "todos",
  "hidratación",
  "energía",
  "recuperación",
  "huesos y articulaciones",
  "básicos",
];

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.2, 0.7, 0.2, 1] as const },
};

export default function Tienda() {
  const [tema, setTema] = useState<Tema>("volt");
  const [cart, setCart] = useState<CartMap>({});
  const [filter, setFilter] = useState<ProductCategory | "todos">("todos");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setTema(readTema());
    setCart(readCart());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  function add(slug: string) {
    const next = { ...cart, [slug]: (cart[slug] ?? 0) + 1 };
    setCart(next);
    writeCart(next);
    // El agente de surtido se hace presente en cada acción de compra
    const p = CATALOG.find((x) => x.slug === slug);
    if (p) setToast(`Surtido reservó 1 ud de ${p.name} para tu pedido`);
  }

  const filtered = useMemo(
    () => (filter === "todos" ? CATALOG : CATALOG.filter((p) => p.category === filter)),
    [filter]
  );

  const display = displayClass(tema);
  const card = `${cardClass(tema)} border-[var(--c-line)]`;
  const pill = pillClass(tema);
  const bodyFont = tema === "volt" ? "font-archivo" : "font-instrument";
  const btn = `inline-flex items-center justify-center gap-1.5 ${pill} bg-[var(--c-accent)] font-extrabold text-[var(--c-onaccent)] transition hover:-translate-y-px hover:bg-[var(--c-accent2)]`;
  const count = cartCount(cart);

  return (
    <div
      style={THEMES[tema]}
      className={`min-h-screen bg-[var(--c-bg)] text-[var(--c-text)] ${bodyFont} tracking-[-0.01em] antialiased`}
    >
      <div className={`${CONTAINER} py-6`}>
        {/* TOPBAR */}
        <div className="flex items-center justify-between pb-6">
          <Link
            href={`/propuestas/${tema}`}
            className={`${display} text-lg tracking-wide transition hover:text-[var(--c-accent)]`}
          >
            RUFIAS
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href={`/?tema=${tema}`}
              className="text-xs font-semibold text-[var(--c-muted)] transition hover:text-[var(--c-accent)]"
            >
              Consulta
            </Link>
            <Link
              href={`/consola?tema=${tema}`}
              className="text-xs font-semibold text-[var(--c-muted)] transition hover:text-[var(--c-accent)]"
            >
              Consola
            </Link>
            <Link
              href={`/carrito?tema=${tema}`}
              className={`relative inline-flex items-center gap-2 border border-[var(--c-line)] ${pill} px-4 py-2 text-xs font-extrabold transition hover:border-[var(--c-accent)]`}
            >
              <ShoppingBag size={14} /> Carrito
              {count > 0 && (
                <span
                  className={`grid h-5 min-w-5 place-items-center ${pill} bg-[var(--c-accent)] px-1 text-[10px] font-black text-[var(--c-onaccent)]`}
                >
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* HEADER */}
        <motion.div {...fadeUp}>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--c-accent)]">
            Catálogo
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <h1 className={`${display} text-[clamp(2.4rem,5vw,4rem)] leading-[0.98]`}>
              La tienda<span className="text-[var(--c-accent)]">.</span>
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--c-muted)]">
              Diez productos, sin pasillos infinitos. Cada uno existe porque un
              corredor lo necesita en alguna fase — y el agente sabe en cuál.
            </p>
          </div>
        </motion.div>

        {/* FILTROS */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.08 }}
          className="mt-7 flex flex-wrap gap-2"
        >
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`${pill} px-4 py-2 text-xs font-bold capitalize transition ${
                filter === c
                  ? "bg-[var(--c-accent)] text-[var(--c-onaccent)]"
                  : "border border-[var(--c-line)] text-[var(--c-muted)] hover:border-[var(--c-accent)] hover:text-[var(--c-text)]"
              }`}
            >
              {c}
            </button>
          ))}
        </motion.div>

        {/* GRID */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => {
            const qty = cart[p.slug] ?? 0;
            return (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className={`${card} group relative flex flex-col bg-[var(--c-surface)] p-6 transition hover:-translate-y-0.5`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--c-muted)]">
                    {p.category}
                  </span>
                  <span className={`${display} text-3xl leading-none text-[var(--c-muted)] opacity-40 transition group-hover:text-[var(--c-accent)] group-hover:opacity-100`}>
                    {p.bib}
                  </span>
                </div>
                {p.badge && (
                  <span
                    className={`mt-3 inline-block self-start ${pill} border border-[var(--c-accent)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--c-accent)]`}
                  >
                    {p.badge}
                  </span>
                )}
                <h3 className="mt-3 text-lg font-extrabold leading-tight">{p.name}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[var(--c-muted)]">
                  {p.blurb}
                </p>
                <p className="mt-3 text-[11.5px] font-bold text-[var(--c-accent)]">{p.dose}</p>
                <p className="mt-1 text-[11px] text-[var(--c-muted)]">
                  {p.stock} unidades · surtido por agente
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-[var(--c-line)] pt-4">
                  <span className="text-xl font-black">{formatMXN(p.price)}</span>
                  {p.badge === "Requiere orientación" ? (
                    // Venta responsable ejecutada por el sistema: este producto
                    // no se vende sin pasar por el agente.
                    <Link
                      href={`/?tema=${tema}`}
                      className={`inline-flex items-center gap-1.5 ${pill} border border-[var(--c-accent)] px-4 py-2 text-xs font-extrabold text-[var(--c-accent)] transition hover:bg-[var(--c-accent)] hover:text-[var(--c-onaccent)]`}
                    >
                      <Bot size={13} /> Consultar al agente
                    </Link>
                  ) : (
                    <button onClick={() => add(p.slug)} className={`${btn} px-4 py-2 text-xs`}>
                      {qty > 0 ? (
                        <>
                          <Check size={13} strokeWidth={3} /> ×{qty}
                        </>
                      ) : (
                        <>
                          <Plus size={13} strokeWidth={3} /> Agregar
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* CTA AL AGENTE */}
        <motion.div
          {...fadeUp}
          className={`${card} mt-8 flex flex-wrap items-center justify-between gap-5 bg-[var(--c-surface)] px-7 py-6`}
        >
          <div className="flex items-center gap-4">
            <Bot size={22} className="shrink-0 text-[var(--c-accent)]" />
            <p className="max-w-xl text-sm leading-relaxed text-[var(--c-muted)]">
              <span className="font-bold text-[var(--c-text)]">
                ¿No sabes cuál necesitas?
              </span>{" "}
              El agente nutriólogo arma tu stack con el porqué de cada producto —
              y te quita lo que no te sirve.
            </p>
          </div>
          <Link href={`/?tema=${tema}`} className={`${btn} px-6 py-3 text-sm`}>
            Hablar con el agente <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </motion.div>

        <p className="mt-8 text-center text-[11px] text-[var(--c-muted)]">
          Prototipo demo · carrito simbólico, sin pagos reales · Información
          general y educativa, no sustituye consejo médico.
        </p>
      </div>

      {/* Toast del agente de surtido */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 ${cardClass(tema)} border-[var(--c-line)] bg-[var(--c-surface)] px-5 py-3 text-[13px] font-semibold shadow-lg`}
        >
          <span
            className="h-2 w-2 animate-pulse rounded-full"
            style={{ background: tema === "volt" ? "#efb23c" : "#a96f0e" }}
          />
          <span
            className="text-[10px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: tema === "volt" ? "#efb23c" : "#a96f0e" }}
          >
            Surtido
          </span>
          {toast.replace(/^Surtido /, "")}
        </motion.div>
      )}
    </div>
  );
}
