"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { AGENTS, FEED_SCRIPT, type AgentKey } from "@/lib/agents";
import { CATALOG, formatMXN } from "@/lib/catalog";

/* Propuesta B — "Lab Wellness": claro, clínico y premium. Fraunces + Instrument Sans. */

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const },
};

const FEATURED = CATALOG.slice(0, 6);

// Última acción por agente para las "tarjetas de turno"
const LAST_ACTION: Record<AgentKey, string> = {
  datos: "12 corredores con carga >15% detectados esta semana",
  captacion: "Guía «sodio por hora» publicada y enlazada",
  venta: "Derivó a un cliente con hipertensión a su médico",
  surtido: "Orden de compra de electrolitos preparada",
  retencion: "Pausó la suscripción de una corredora lesionada",
};

export default function LabLanding() {
  return (
    <div className="min-h-screen bg-cream font-instrument text-inkdeep antialiased">
      {/* Volver al comparador */}
      <Link
        href="/propuestas"
        className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full border border-inkdeep/15 bg-cream/90 px-4 py-2 text-xs font-medium text-inkdeep/60 backdrop-blur transition hover:text-pine"
      >
        <ArrowLeft size={13} /> Propuestas · B — Lab Wellness
      </Link>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-inkdeep/10 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="font-fraunces text-[22px] font-semibold tracking-tight">
            Rufias<span className="text-pine">.</span>
          </span>
          <nav className="hidden items-center gap-8 text-[13.5px] font-medium text-inkdeep/60 md:flex">
            <a href="#metodo" className="transition hover:text-inkdeep">El método</a>
            <a href="#formulas" className="transition hover:text-inkdeep">Fórmulas</a>
            <a href="#equipo" className="transition hover:text-inkdeep">El equipo</a>
            <Link href="/tienda?tema=lab" className="transition hover:text-inkdeep">Tienda</Link>
            <Link href="/propuestas" className="transition hover:text-pine">Propuestas</Link>
            <Link
              href="/consulta?tema=lab"
              className="rounded-full bg-pine px-5 py-2.5 font-semibold text-cream transition hover:bg-pine2"
            >
              Iniciar consulta
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-inkdeep/10">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
          <div>
            <motion.p
              {...fadeUp}
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-pine"
            >
              Suplementación para corredores
            </motion.p>
            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.08 }}
              className="mt-6 font-fraunces text-[clamp(2.6rem,5.5vw,4.6rem)] font-medium leading-[1.04] tracking-tight"
            >
              La dosis correcta,
              <br />
              según <em className="text-pine">tu</em> entrenamiento.
            </motion.h1>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.16 }}
              className="mt-6 max-w-md text-[16.5px] leading-relaxed text-inkdeep/65"
            >
              Un agente nutriólogo conversa contigo, entiende tu volumen, tu
              objetivo y tus riesgos, y formula tu stack con evidencia — no con
              marketing. Strava es opcional: con contarle basta.
            </motion.p>
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.24 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/consulta?tema=lab"
                className="inline-flex items-center gap-2 rounded-full bg-pine px-7 py-3.5 text-[15px] font-semibold text-cream transition hover:-translate-y-0.5 hover:bg-pine2"
              >
                Iniciar mi consulta <ArrowRight size={16} />
              </Link>
              <span className="text-[13px] text-inkdeep/50">
                Gratuita · 3 minutos · sin registro
              </span>
            </motion.div>
          </div>

          {/* Ficha de formulación */}
          <motion.aside
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="rounded-2xl border border-inkdeep/12 bg-white p-7 shadow-[0_1px_0_rgba(20,20,15,0.04)]"
          >
            <div className="flex items-baseline justify-between border-b border-inkdeep/10 pb-4">
              <span className="font-fraunces text-lg font-semibold">Ficha de formulación</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-inkdeep/40">
                Nº 2026-0612
              </span>
            </div>
            <dl className="mt-4 space-y-1.5 text-[13px] text-inkdeep/60">
              <div className="flex justify-between">
                <dt>Perfil</dt>
                <dd className="font-medium text-inkdeep">Maratón · fase de volumen</dd>
              </div>
              <div className="flex justify-between">
                <dt>Carga</dt>
                <dd className="font-medium text-inkdeep">42 km/sem · +18% mensual</dd>
              </div>
              <div className="flex justify-between">
                <dt>Restricciones</dt>
                <dd className="font-medium text-inkdeep">Sin alergias declaradas</dd>
              </div>
            </dl>
            <div className="mt-5 space-y-3 border-t border-inkdeep/10 pt-5">
              {[
                ["Vitamina D3 + K2", "1000–2000 UI/día", "estrés óseo por carga en subida"],
                ["Magnesio glicinato", "200–300 mg/noche", "recuperación y sueño"],
                ["Electrolitos", "300–600 mg Na/h", "tiradas largas de 21 km"],
              ].map(([n, d, w]) => (
                <div key={n} className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[14px] font-semibold">{n}</div>
                    <div className="text-[12px] text-inkdeep/55">{w}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-sage px-3 py-1 text-[11px] font-semibold text-pine">
                    {d}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-xl bg-sage/60 px-4 py-3">
              <span className="text-[12.5px] font-medium text-pine">
                Match con tu perfil
              </span>
              <span className="font-fraunces text-3xl font-semibold text-pine">96%</span>
            </div>
            <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-inkdeep/50">
              <Check size={13} className="mt-0.5 shrink-0 text-pine" />
              Revisada por el agente de venta responsable: sin diagnósticos, dosis
              en rangos generales, derivación médica cuando aplica.
            </p>
          </motion.aside>
        </div>
      </section>

      {/* PRINCIPIOS */}
      <section className="border-b border-inkdeep/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-inkdeep/10 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ["Sin diagnósticos", "El agente nunca te dice qué tienes. Te dice qué preguntar y a quién."],
            ["Rangos seguros", "Toda dosis vive dentro de rangos generales respaldados — nunca megadosis."],
            ["Derivación médica", "¿Condición, embarazo o medicamentos? Primero tu profesional de salud."],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="px-8 py-10"
            >
              <span className="font-fraunces text-[15px] font-semibold text-pine">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-fraunces text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-inkdeep/60">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MÉTODO */}
      <section id="metodo" className="border-b border-inkdeep/10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.p {...fadeUp} className="text-[11px] font-semibold uppercase tracking-[0.3em] text-pine">
            El método
          </motion.p>
          <motion.h2
            {...fadeUp}
            className="mt-5 max-w-2xl font-fraunces text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.06] tracking-tight"
          >
            Tres pasos. Cero adivinanzas.
          </motion.h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              ["Consulta", "Conversación natural con el agente nutriólogo: objetivo, entrenamiento y riesgos. Si conectas Strava (opcional), lee tus datos reales."],
              ["Formulación", "Tu stack llega como una ficha: cada compuesto con su porqué, su dosis y su evidencia. Lo que no necesitas, no aparece."],
              ["Seguimiento", "Cada mes la fórmula se recalcula con tu fase de entrenamiento. Si paras, tu plan se pausa — sin cargos fantasma."],
            ].map(([t, d], i) => (
              <motion.div key={t} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-pine/30 font-fraunces text-[15px] font-semibold text-pine">
                  {i + 1}
                </div>
                <h3 className="mt-5 font-fraunces text-2xl font-semibold">{t}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-inkdeep/60">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FÓRMULAS */}
      <section id="formulas" className="border-b border-inkdeep/10 bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <motion.h2
              {...fadeUp}
              className="font-fraunces text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.06] tracking-tight"
            >
              Las fórmulas.
            </motion.h2>
            <motion.div {...fadeUp} className="max-w-sm">
              <p className="text-[13.5px] leading-relaxed text-inkdeep/55">
                Diez compuestos, no diez mil. Cada uno existe porque un corredor lo
                necesita en alguna fase — y el agente sabe en cuál.
              </p>
              <Link
                href="/tienda?tema=lab"
                className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-pine transition hover:underline"
              >
                Ver catálogo completo <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-inkdeep/12 bg-inkdeep/12 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((p, i) => (
              <motion.article
                key={p.slug}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="group relative bg-white p-7 transition hover:bg-cream"
              >
                <Link
                  href="/tienda?tema=lab"
                  aria-label={`Ver ${p.name} en la tienda`}
                  className="absolute inset-0 z-10"
                />
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-inkdeep/40">
                    {p.category}
                  </span>
                  <span className="font-fraunces text-[13px] text-inkdeep/35">Nº {p.bib}</span>
                </div>
                <h3 className="mt-4 font-fraunces text-[22px] font-semibold leading-tight">
                  {p.name}
                </h3>
                <p className="mt-2 min-h-[44px] text-[13.5px] leading-relaxed text-inkdeep/60">
                  {p.blurb}
                </p>
                <p className="mt-3 inline-block rounded-full bg-sage px-3 py-1 text-[11.5px] font-semibold text-pine">
                  {p.dose}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-inkdeep/10 pt-4">
                  <span className="text-[17px] font-semibold">{formatMXN(p.price)}</span>
                  <span className="text-[13px] font-semibold text-pine transition group-hover:underline">
                    Ver en la tienda →
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* EL EQUIPO (AGENTES) */}
      <section id="equipo" className="border-b border-inkdeep/10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.p {...fadeUp} className="text-[11px] font-semibold uppercase tracking-[0.3em] text-pine">
            Operación con agentes de IA
          </motion.p>
          <motion.h2
            {...fadeUp}
            className="mt-5 max-w-2xl font-fraunces text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.06] tracking-tight"
          >
            El equipo que nunca duerme.
          </motion.h2>
          <motion.p {...fadeUp} className="mt-4 max-w-xl text-[15px] leading-relaxed text-inkdeep/60">
            Cinco agentes operan la tienda en turnos de 24 horas: leen señales,
            ajustan inventario, escriben contenido y cuidan a cada corredor.
            Puedes verlos trabajar en vivo.
          </motion.p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(Object.keys(AGENTS) as AgentKey[]).map((k, i) => (
              <motion.article
                key={k}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className="rounded-2xl border border-inkdeep/12 bg-white p-5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 animate-pulse rounded-full"
                    style={{ background: AGENTS[k].color === "#cdff47" ? "#7a9a1e" : AGENTS[k].color }}
                  />
                  <span className="text-[13px] font-semibold">{AGENTS[k].label}</span>
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.12em] text-inkdeep/35">
                    En turno
                  </span>
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-inkdeep/60">
                  {LAST_ACTION[k]}
                </p>
              </motion.article>
            ))}
          </div>
          <motion.div {...fadeUp} className="mt-8">
            <Link
              href="/consola?tema=lab"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-pine transition hover:underline"
            >
              Abrir la consola de operación <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="px-6 py-24">
        <motion.blockquote
          {...fadeUp}
          className="mx-auto max-w-3xl text-center font-fraunces text-[clamp(1.6rem,3.5vw,2.6rem)] font-medium italic leading-[1.25] tracking-tight"
        >
          “Una tienda que a veces decide{" "}
          <span className="text-pine">no venderte</span> es la única en la que
          vale la pena comprar.”
        </motion.blockquote>
        <motion.p {...fadeUp} className="mt-6 text-center text-[12px] font-semibold uppercase tracking-[0.2em] text-inkdeep/40">
          Principio operativo Nº 1 de Rufias
        </motion.p>
      </section>

      {/* CTA FINAL */}
      <section className="bg-pine px-6 py-24 text-cream">
        <div className="mx-auto max-w-7xl text-center">
          <motion.h2
            {...fadeUp}
            className="mx-auto max-w-2xl font-fraunces text-[clamp(2.2rem,5vw,3.8rem)] font-medium leading-[1.05] tracking-tight"
          >
            Tu fórmula te está esperando.
          </motion.h2>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <Link
              href="/consulta?tema=lab"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-[15px] font-semibold text-pine transition hover:-translate-y-0.5"
            >
              Iniciar mi consulta <ArrowRight size={16} />
            </Link>
          </motion.div>
          <p className="mt-8 text-[12px] opacity-70">
            Información general y educativa. No sustituye consejo médico,
            diagnóstico ni tratamiento.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-[12.5px] text-inkdeep/50">
          <span className="font-fraunces text-[16px] font-semibold text-inkdeep">
            Rufias<span className="text-pine">.</span>
          </span>
          <span>Prototipo demo · Strava simulado y opcional · Carrito simbólico</span>
          <Link href="/consola?tema=lab" className="font-semibold transition hover:text-pine">
            Consola de operación ↗
          </Link>
        </div>
      </footer>
    </div>
  );
}
