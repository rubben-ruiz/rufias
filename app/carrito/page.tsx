"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, Minus, Plus, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { CATALOG, formatMXN } from "@/lib/catalog";
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

/* Carrito simbólico con checkout simulado. Aquí se conectaría Stripe en producción. */

export default function Carrito() {
  const [tema, setTema] = useState<Tema>("volt");
  const [cart, setCart] = useState<CartMap>({});
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  // Cuenta simulada: el "contrato" con los agentes recurrentes (demo, sin auth real)
  const [account, setAccount] = useState<"none" | "creating" | "done">("none");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setTema(readTema());
    setCart(readCart());
  }, []);

  const items = useMemo(
    () =>
      Object.entries(cart)
        .map(([slug, qty]) => ({ product: CATALOG.find((p) => p.slug === slug), qty }))
        .filter((x): x is { product: (typeof CATALOG)[number]; qty: number } => !!x.product),
    [cart]
  );
  const subtotal = items.reduce((sum, { product, qty }) => sum + product.price * qty, 0);

  function setQty(slug: string, qty: number) {
    const next = { ...cart };
    if (qty <= 0) delete next[slug];
    else next[slug] = qty;
    setCart(next);
    writeCart(next);
  }

  function createAccount() {
    if (!email.trim() || account !== "none") return;
    setAccount("creating");
    // Demo: en producción aquí iría Firebase Auth (Google o email)
    setTimeout(() => setAccount("done"), 1100);
  }

  function checkout() {
    if (processing || items.length === 0) return;
    setProcessing(true);
    setOrderTotal(subtotal);
    // Pago simulado: en producción aquí iría Stripe Checkout.
    setTimeout(() => {
      writeCart({});
      setCart({});
      setProcessing(false);
      setDone(true);
    }, 1400);
  }

  const display = displayClass(tema);
  const card = `${cardClass(tema)} border-[var(--c-line)]`;
  const pill = pillClass(tema);
  const bodyFont = tema === "volt" ? "font-archivo" : "font-instrument";
  const btn = `inline-flex items-center justify-center gap-2 ${pill} bg-[var(--c-accent)] font-extrabold text-[var(--c-onaccent)] transition hover:-translate-y-px hover:bg-[var(--c-accent2)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0`;
  const ghost = `inline-flex items-center justify-center ${pill} border border-[var(--c-line)] font-semibold text-[var(--c-muted)] transition hover:border-[var(--c-accent)] hover:text-[var(--c-text)]`;

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
              href={`/tienda?tema=${tema}`}
              className="text-xs font-semibold text-[var(--c-muted)] transition hover:text-[var(--c-accent)]"
            >
              Tienda
            </Link>
            <Link
              href={`/consulta?tema=${tema}`}
              className="text-xs font-semibold text-[var(--c-muted)] transition hover:text-[var(--c-accent)]"
            >
              Consulta
            </Link>
          </div>
        </div>

        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--c-accent)]">
          Carrito · demo
        </p>
        <h1 className={`${display} mt-3 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[0.98]`}>
          Tu pedido<span className="text-[var(--c-accent)]">.</span>
        </h1>

        {/* CONFIRMACIÓN */}
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${card} mx-auto mt-10 max-w-xl bg-[var(--c-surface)] p-10 text-center`}
          >
            <span
              className={`mx-auto grid h-14 w-14 place-items-center ${pill} bg-[var(--c-accent)] text-[var(--c-onaccent)]`}
            >
              <Check size={26} strokeWidth={3} />
            </span>
            <h2 className={`${display} mt-5 text-3xl`}>Pedido demo confirmado</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--c-muted)]">
              Total simulado: <b className="text-[var(--c-text)]">{formatMXN(orderTotal)}</b>.
              No se procesó ningún pago — en producción este paso se conecta a
              Stripe y el agente de surtido reserva tu inventario al instante.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href={`/tienda?tema=${tema}`} className={`${btn} px-6 py-3 text-sm`}>
                Volver a la tienda
              </Link>
              <Link href={`/consola?tema=${tema}`} className={`${ghost} px-6 py-3 text-sm`}>
                Ver a los agentes trabajar
              </Link>
            </div>
          </motion.div>
        )}

        {/* Cuenta = el contrato con los agentes recurrentes (simulado) */}
        {done && account !== "done" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={`${card} mx-auto mt-4 max-w-xl bg-[var(--c-surface)] p-8`}
          >
            <div className="flex items-center gap-2.5">
              <UserPlus size={18} className="text-[var(--c-accent)]" />
              <h3 className="text-[15px] font-extrabold">
                Activa el resurtido automático
              </h3>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--c-muted)]">
              Comprar no requiere cuenta. Pero para que los agentes trabajen para
              ti todos los días, necesitan saber quién eres:
            </p>
            <ul className="mt-4 space-y-2.5">
              {(
                [
                  ["#efb23c", "Surtido", "reserva tu próximo envío según tu fase de entrenamiento"],
                  ["#5ba0e8", "Datos", "recalcula tu stack cada mes con tu entrenamiento real"],
                  ["var(--c-accent)", "Retención", "si dejas de correr, pausa tu plan solo — sin cargos"],
                ] as const
              ).map(([color, agent, text]) => (
                <li key={agent} className="flex items-start gap-2.5 text-[13px] leading-snug">
                  <span
                    className="mt-1 h-2 w-2 shrink-0 animate-pulse rounded-full"
                    style={{ background: color }}
                  />
                  <span className="text-[var(--c-muted)]">
                    <b className="text-[var(--c-text)]">{agent}</b> {text}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createAccount()}
                placeholder="tu@correo.com"
                type="email"
                className={`${tema === "editorial" ? "rounded-none" : "rounded-xl"} w-full border border-[var(--c-line)] bg-[var(--c-surface2)] px-4 py-3 text-sm text-[var(--c-text)] outline-none transition placeholder:text-[var(--c-muted)] focus:border-[var(--c-accent)]`}
              />
              <button
                onClick={createAccount}
                disabled={!email.trim() || account === "creating"}
                className={`${btn} shrink-0 px-5 py-3 text-sm`}
              >
                {account === "creating" ? "Creando…" : "Crear cuenta"}
              </button>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[var(--c-muted)]">
              Demo: sin registro real. En producción este paso usa Firebase Auth
              (Google o email).
            </p>
          </motion.div>
        )}

        {done && account === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${card} mx-auto mt-4 max-w-xl bg-[var(--c-surface)] p-8 text-center`}
          >
            <span
              className={`mx-auto grid h-11 w-11 place-items-center ${pill} border border-[var(--c-accent)] text-[var(--c-accent)]`}
            >
              <Check size={20} strokeWidth={3} />
            </span>
            <h3 className="mt-4 text-[16px] font-extrabold">
              Cuenta demo activa — los agentes ya trabajan para ti
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--c-muted)]">
              Surtido programó tu primer resurtido según tu fase de entrenamiento
              y Retención vigila tus señales. Puedes verlos en la consola.
            </p>
            <Link
              href={`/consola?tema=${tema}`}
              className={`${btn} mt-5 inline-flex px-6 py-3 text-sm`}
            >
              Abrir la consola <ArrowRight size={15} />
            </Link>
          </motion.div>
        )}

        {/* VACÍO */}
        {!done && items.length === 0 && (
          <div className={`${card} mx-auto mt-10 max-w-xl bg-[var(--c-surface)] p-10 text-center`}>
            <p className="text-sm leading-relaxed text-[var(--c-muted)]">
              Tu carrito está vacío. Explora el catálogo o deja que el agente
              arme tu stack con porqué.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href={`/tienda?tema=${tema}`} className={`${btn} px-6 py-3 text-sm`}>
                Ir a la tienda <ArrowRight size={15} />
              </Link>
              <Link href={`/consulta?tema=${tema}`} className={`${ghost} px-6 py-3 text-sm`}>
                Hablar con el agente
              </Link>
            </div>
          </div>
        )}

        {/* ITEMS + RESUMEN */}
        {!done && items.length > 0 && (
          <div className="mt-8 grid items-start gap-5 lg:grid-cols-[1fr_380px]">
            <div className="flex flex-col gap-3">
              {items.map(({ product: p, qty }) => (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${card} flex flex-wrap items-center gap-4 bg-[var(--c-surface)] p-5`}
                >
                  <span className={`${display} w-10 text-2xl text-[var(--c-accent)]`}>
                    {p.bib}
                  </span>
                  <div className="min-w-[180px] flex-1">
                    <h3 className="text-[15px] font-extrabold">{p.name}</h3>
                    <p className="mt-0.5 text-[11.5px] text-[var(--c-muted)]">{p.dose}</p>
                  </div>
                  <div className={`flex items-center gap-1 border border-[var(--c-line)] ${pill} px-1.5 py-1`}>
                    <button
                      onClick={() => setQty(p.slug, qty - 1)}
                      aria-label="Quitar uno"
                      className="grid h-6 w-6 place-items-center text-[var(--c-muted)] transition hover:text-[var(--c-accent)]"
                    >
                      <Minus size={13} strokeWidth={3} />
                    </button>
                    <span className="w-6 text-center text-sm font-extrabold">{qty}</span>
                    <button
                      onClick={() => setQty(p.slug, qty + 1)}
                      aria-label="Agregar uno"
                      className="grid h-6 w-6 place-items-center text-[var(--c-muted)] transition hover:text-[var(--c-accent)]"
                    >
                      <Plus size={13} strokeWidth={3} />
                    </button>
                  </div>
                  <span className="w-24 text-right text-[15px] font-black">
                    {formatMXN(p.price * qty)}
                  </span>
                  <button
                    onClick={() => setQty(p.slug, 0)}
                    aria-label="Eliminar del carrito"
                    className="text-[var(--c-muted)] transition hover:text-[var(--c-accent)]"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className={`${card} bg-[var(--c-surface)] p-6`}>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--c-muted)]">
                Resumen
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--c-muted)]">
                    Subtotal ({cartCount(cart)} productos)
                  </dt>
                  <dd className="font-bold">{formatMXN(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--c-muted)]">Envío</dt>
                  <dd className="font-bold text-[var(--c-accent)]">Gratis (demo)</dd>
                </div>
                <div className="flex justify-between border-t border-[var(--c-line)] pt-3 text-base">
                  <dt className="font-extrabold">Total</dt>
                  <dd className={`${display} text-2xl text-[var(--c-accent)]`}>
                    {formatMXN(subtotal)}
                  </dd>
                </div>
              </dl>
              <button
                onClick={checkout}
                disabled={processing}
                className={`${btn} mt-5 w-full py-4 text-[15px]`}
              >
                {processing ? "Procesando pago demo…" : "Pagar (simulado)"}
              </button>
              <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-[var(--c-muted)]">
                <ShieldCheck size={13} className="mt-0.5 shrink-0 text-[var(--c-accent)]" />
                Demo: no se procesa ningún pago ni se piden datos. En producción,
                este botón abre Stripe Checkout.
              </p>
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-[11px] text-[var(--c-muted)]">
          Información general y educativa. No sustituye consejo médico.
        </p>
      </div>
    </div>
  );
}
