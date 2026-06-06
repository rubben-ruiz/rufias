"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Gauge,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { AGENTS, FEED_SCRIPT } from "@/lib/agents";
import { CATALOG, formatMXN } from "@/lib/catalog";

/* Propuesta A — "Volt Track": dark atlético, volt como única tinta de energía */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const },
};

const FEATURED = CATALOG.slice(0, 4);

export default function VoltLanding() {
  return (
    <div className="min-h-screen bg-coal text-bone font-archivo tracking-[-0.01em] antialiased">
      {/* Volver al comparador */}
      <Link
        href="/propuestas"
        className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full border border-white/15 bg-coal/80 px-4 py-2 text-xs font-semibold text-mute backdrop-blur transition hover:text-volt"
      >
        <ArrowLeft size={13} /> Propuestas · A — Volt Track
      </Link>

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-coal/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="text-lg font-black tracking-[0.14em]">
            RUFIAS<span className="align-super text-[10px] text-volt">®</span>
          </span>
          <nav className="hidden items-center gap-7 text-[13px] font-semibold text-mute md:flex">
            <a href="#como" className="transition hover:text-bone">Cómo funciona</a>
            <a href="#stack" className="transition hover:text-bone">El stack</a>
            <a href="#operacion" className="transition hover:text-bone">Operación</a>
            <Link href="/tienda?tema=volt" className="transition hover:text-bone">Tienda</Link>
            <Link href="/propuestas" className="transition hover:text-volt">Propuestas</Link>
            <Link
              href="/?tema=volt"
              className="rounded-full bg-volt px-5 py-2.5 font-extrabold text-coal transition hover:bg-volt2"
            >
              Arma mi stack
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-20 pt-36">
        {/* carriles de pista */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(100deg,transparent_0_180px,rgba(255,255,255,0.06)_180px_181px)] [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 top-24 select-none text-[26rem] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.06)]"
        >
          42K
        </span>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <motion.p
              {...fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-volt/25 bg-volt/10 px-4 py-2 text-[11px] font-bold tracking-[0.28em] text-volt"
            >
              <Zap size={12} /> OPERADA POR AGENTES DE IA
            </motion.p>
            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.08 }}
              className="mt-7 flex flex-col text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-[0.92]"
            >
              <span>Corre.</span>
              <span className="text-transparent [-webkit-text-stroke:1.5px_#9c9c96]">
                Recupera.
              </span>
              <span className="text-volt">Repite.</span>
            </motion.h1>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.16 }}
              className="mt-7 max-w-md text-lg leading-relaxed text-mute"
            >
              Un agente nutriólogo lee tu entrenamiento y arma tu stack de
              suplementos con el <strong className="text-bone">porqué de cada uno</strong>.
              Conecta tu Strava si quieres — o solo cuéntale cómo entrenas.
            </motion.p>
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.24 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/?tema=volt"
                className="inline-flex items-center gap-2.5 rounded-full bg-volt px-7 py-4 text-[15px] font-extrabold text-coal transition hover:-translate-y-0.5 hover:bg-volt2"
              >
                Arma mi stack <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
              <Link
                href="/consola?tema=volt"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-4 text-[14px] font-semibold text-mute transition hover:border-volt hover:text-bone"
              >
                Ver agentes en vivo <ArrowUpRight size={15} />
              </Link>
            </motion.div>
          </div>

          {/* tarjeta de telemetría */}
          <motion.aside
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="rounded-3xl border border-white/10 bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[0.22em] text-mute">
                TU SEMANA
              </span>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] text-strava">
                <i className="h-2 w-2 rounded-sm bg-strava" /> STRAVA · OPCIONAL
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["42 km", "por semana"],
                ["+18%", "de carga"],
                ["5:30", "ritmo /km"],
                ["21 km", "tirada larga"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-surface2 p-4">
                  <div className="text-2xl font-black">{v}</div>
                  <div className="mt-0.5 text-[11px] font-semibold text-mute">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 rounded-2xl bg-surface2 p-4">
              <div className="text-5xl font-black text-volt">96%</div>
              <div className="text-[13px] leading-snug text-mute">
                de match con tu stack
                <br />
                <span className="text-bone">recalculado cada mes</span>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-mute">
              Sin Strava también funciona: el agente te pregunta lo que necesita
              saber, una cosa a la vez.
            </p>
          </motion.aside>
        </div>
      </section>

      {/* TICKER DE AGENTES */}
      <div className="overflow-hidden border-y border-volt/30 bg-volt py-3 text-coal">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[0, 1].map((k) => (
            <span key={k} className="flex items-center text-[13px] font-extrabold tracking-wide">
              {FEED_SCRIPT.slice(0, 8).map((ev, i) => (
                <span key={i} className="flex items-center">
                  <span className="uppercase">{AGENTS[ev.agent].label}</span>
                  <span className="mx-2 font-medium normal-case opacity-80">{ev.text}</span>
                  <span className="mx-4">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ["1,204", "decisiones de agentes hoy"],
            ["92%", "retención a 30 días"],
            ["7", "ventas rechazadas por seguridad — a propósito"],
          ].map(([v, l], i) => (
            <motion.div key={l} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="px-8 py-10">
              <div className="text-5xl font-black text-volt">{v}</div>
              <div className="mt-2 text-[13px] font-semibold text-mute">{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.p {...fadeUp} className="text-[11px] font-bold tracking-[0.28em] text-volt">
            CÓMO FUNCIONA
          </motion.p>
          <motion.h2
            {...fadeUp}
            className="mt-4 max-w-xl text-[clamp(2rem,4.5vw,3.5rem)] font-black uppercase leading-[0.98]"
          >
            Tu nutriólogo corre turnos de 24 horas.
          </motion.h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Cuéntale al agente",
                d: "Una consulta conversacional, una pregunta a la vez. Conecta tu Strava si quieres más precisión — es opcional.",
                Icon: Bot,
              },
              {
                n: "02",
                t: "Recibe tu stack con porqué",
                d: "Cada suplemento llega con la razón atada a tu entrenamiento y dosis en rangos generales seguros.",
                Icon: Sparkles,
              },
              {
                n: "03",
                t: "Evoluciona contigo",
                d: "Tu fórmula se reajusta según tu fase: base, pico, tapering o descanso. Si dejas de correr, también lo nota.",
                Icon: Gauge,
              },
            ].map(({ n, t, d, Icon }, i) => (
              <motion.article
                key={n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="group rounded-3xl border border-white/10 bg-surface p-7 transition hover:border-volt/40"
              >
                <div className="flex items-start justify-between">
                  <span className="text-6xl font-black text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.18)] transition group-hover:[-webkit-text-stroke:1px_#cdff47]">
                    {n}
                  </span>
                  <Icon size={20} className="text-volt" />
                </div>
                <h3 className="mt-6 text-lg font-extrabold">{t}</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-mute">{d}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section id="stack" className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <motion.p {...fadeUp} className="text-[11px] font-bold tracking-[0.28em] text-volt">
                EL STACK
              </motion.p>
              <motion.h2
                {...fadeUp}
                className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-black uppercase leading-[0.98]"
              >
                Cada producto tiene dorsal.
              </motion.h2>
            </div>
            <motion.div {...fadeUp} className="max-w-xs">
              <p className="text-[13px] leading-relaxed text-mute">
                Catálogo corto a propósito: solo lo que un corredor necesita, sin
                pasillos infinitos de polvos mágicos.
              </p>
              <Link
                href="/tienda?tema=volt"
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-extrabold text-volt transition hover:gap-2.5"
              >
                Ver catálogo completo <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </motion.div>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED.map((p, i) => (
              <motion.article
                key={p.slug}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-surface p-6 transition hover:-translate-y-1 hover:border-volt/40"
              >
                <Link
                  href="/tienda?tema=volt"
                  aria-label={`Ver ${p.name} en la tienda`}
                  className="absolute inset-0 z-10"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-3 -top-6 select-none text-[7rem] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)] transition group-hover:[-webkit-text-stroke:1px_rgba(205,255,71,0.35)]"
                >
                  {p.bib}
                </span>
                <span className="relative inline-block rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-mute">
                  {p.category}
                </span>
                <h3 className="relative mt-10 text-lg font-extrabold leading-tight">{p.name}</h3>
                <p className="relative mt-2 min-h-[60px] text-[13px] leading-relaxed text-mute">
                  {p.blurb}
                </p>
                <p className="relative mt-3 text-[11.5px] font-bold text-volt">{p.dose}</p>
                <div className="relative mt-5 flex items-center justify-between">
                  <span className="text-xl font-black">{formatMXN(p.price)}</span>
                  <span className="rounded-full bg-volt px-4 py-2 text-[12px] font-extrabold text-coal transition group-hover:bg-volt2">
                    Ver en tienda
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* VENTA RESPONSABLE + OPERACIÓN */}
      <section id="operacion" className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <motion.div {...fadeUp} className="rounded-3xl border border-white/10 bg-surface p-9">
            <ShieldCheck size={26} className="text-volt" />
            <h3 className="mt-5 text-3xl font-black uppercase leading-tight">
              Vende menos.
              <br />A propósito.
            </h3>
            <ul className="mt-6 space-y-4 text-[14.5px] leading-relaxed text-mute">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
                Sin diagnósticos ni promesas médicas. Dosis solo en rangos generales seguros.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
                ¿Condición médica, embarazo o medicamentos? El agente te deriva a
                un profesional antes de venderte nada.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
                Si dejas de correr, tu suscripción se pausa sola. Nadie te
                empuja producto que no necesitas.
              </li>
            </ul>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="flex flex-col rounded-3xl border border-white/10 bg-surface p-9"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black uppercase leading-tight">
                La tienda
                <br />
                se opera sola.
              </h3>
              <span className="inline-flex items-center gap-2 rounded-full border border-volt/40 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-volt">
                <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-volt" /> EN VIVO
              </span>
            </div>
            <ul className="mt-6 flex-1 space-y-3.5">
              {FEED_SCRIPT.slice(0, 5).map((ev, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] leading-snug">
                  <span
                    className="mt-0.5 shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold"
                    style={{ color: AGENTS[ev.agent].color, borderColor: AGENTS[ev.agent].color }}
                  >
                    {AGENTS[ev.agent].label}
                  </span>
                  <span className="text-mute">{ev.text}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/consola?tema=volt"
              className="mt-7 inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-5 py-3 text-[13px] font-bold transition hover:border-volt hover:text-volt"
            >
              Abrir la consola de operación <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.p {...fadeUp} className="text-[11px] font-bold tracking-[0.28em] text-volt">
            CORREDORES REALES (MOCK)
          </motion.p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["«Me dijo que NO comprara creatina todavía. Una tienda que te quita cosas del carrito — eso es nuevo.»", "Mariana G. · Maratón CDMX"],
              ["«Conecté mi Strava y el stack cambió solo cuando empecé el tapering. Ni lo pedí.»", "Diego R. · 21K GDL"],
              ["«No tengo Strava y dio igual: tres preguntas y mi fórmula tenía más sentido que la del influencer.»", "Sofía L. · 10K"],
            ].map(([q, a], i) => (
              <motion.blockquote
                key={a}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="rounded-3xl border border-white/10 bg-surface p-7"
              >
                <p className="text-[15px] leading-relaxed">{q}</p>
                <footer className="mt-5 text-[12px] font-bold tracking-wide text-mute">{a}</footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-volt px-6 py-24 text-coal">
        <div className="mx-auto max-w-7xl text-center">
          <motion.h2
            {...fadeUp}
            className="mx-auto max-w-3xl text-[clamp(2.5rem,6vw,5rem)] font-black uppercase leading-[0.95]"
          >
            Tu próxima temporada empieza hoy.
          </motion.h2>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <Link
              href="/?tema=volt"
              className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-coal px-8 py-4 text-[15px] font-extrabold text-volt transition hover:-translate-y-0.5"
            >
              Hablar con el agente <ArrowRight size={17} strokeWidth={2.5} />
            </Link>
          </motion.div>
          <p className="mt-8 text-[12px] font-semibold opacity-70">
            Información general y educativa. No sustituye consejo médico.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-[12px] text-mute">
          <span className="font-black tracking-[0.14em] text-bone">RUFIAS®</span>
          <span>Prototipo demo · Strava simulado y opcional · Carrito simbólico</span>
          <Link href="/consola?tema=volt" className="font-semibold transition hover:text-volt">
            Consola de operación ↗
          </Link>
        </div>
      </footer>
    </div>
  );
}
