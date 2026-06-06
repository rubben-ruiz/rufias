"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AGENTS, FEED_SCRIPT } from "@/lib/agents";
import { CATALOG, formatMXN } from "@/lib/catalog";

/* Propuesta C — "Editorial Sport": gaceta deportiva retro. Anton + Instrument Serif. */

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const },
};

const FEATURED = CATALOG.slice(0, 4);

export default function EditorialLanding() {
  return (
    <div className="min-h-screen bg-paper font-instrument text-inked antialiased">
      {/* Volver al comparador */}
      <Link
        href="/propuestas"
        className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 border border-inked/20 bg-paper/90 px-4 py-2 text-xs font-medium text-inked/60 backdrop-blur transition hover:text-maroon"
      >
        <ArrowLeft size={13} /> Propuestas · C — Editorial Sport
      </Link>

      {/* MASTHEAD */}
      <header className="border-b-2 border-inked">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-inked/60">
          <span>Vol. 01 · Temporada de maratón</span>
          <span className="hidden sm:block">Ciudad de México</span>
          <span>Operada por agentes de IA</span>
        </div>
        <div className="border-t border-inked/20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <span className="font-anton text-3xl uppercase tracking-wide">
              Rufias<span className="text-maroon">★</span>
            </span>
            <nav className="hidden items-center gap-7 text-[13px] font-semibold uppercase tracking-[0.08em] text-inked/60 md:flex">
              <a href="#tablon" className="transition hover:text-inked">El tablón</a>
              <a href="#dorsales" className="transition hover:text-inked">Dorsales</a>
              <a href="#club" className="transition hover:text-inked">El club</a>
              <Link href="/tienda?tema=editorial" className="transition hover:text-inked">Tienda</Link>
              <Link href="/propuestas" className="transition hover:text-maroon">Propuestas</Link>
              <Link
                href="/consulta?tema=editorial"
                className="border-2 border-inked bg-inked px-5 py-2 font-anton text-[14px] uppercase tracking-wider text-paper transition hover:bg-maroon hover:border-maroon"
              >
                Empieza tu temporada
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-inked">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <motion.div {...fadeUp} className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-maroon">
            <span className="h-px w-10 bg-maroon" /> La gaceta del corredor
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="mt-6 font-anton text-[clamp(3.2rem,10vw,8.8rem)] uppercase leading-[0.95] tracking-tight"
          >
            Vuelve a salir
            <br />
            <span className="relative inline-block">
              <span className="absolute inset-x-0 bottom-[0.08em] top-[0.14em] -rotate-1 bg-maroon" aria-hidden />
              <span className="relative px-3 text-paper">a correr.</span>
            </span>
          </motion.h1>
          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.16 }}
              className="max-w-xl font-iserif text-[clamp(1.25rem,2.4vw,1.7rem)] italic leading-snug text-inked/80"
            >
              Suplementos con porqué, despachados por una tienda que se opera
              sola — y que prefiere no venderte antes que venderte mal.
            </motion.p>
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.22 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href="/consulta?tema=editorial"
                className="inline-flex items-center gap-2.5 border-2 border-inked bg-gold px-7 py-3.5 font-anton text-[16px] uppercase tracking-wider text-inked transition hover:-translate-y-0.5"
              >
                Consulta gratuita <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
              <span className="text-[12.5px] font-medium text-inked/55">
                Strava opcional · sin registro
              </span>
            </motion.div>
          </div>
        </div>
        {/* estrellas decorativas */}
        <span aria-hidden className="absolute right-8 top-10 font-anton text-5xl text-gold">★</span>
        <span aria-hidden className="absolute bottom-10 right-24 font-anton text-2xl text-maroon/40">★</span>
      </section>

      {/* MARCADOR (ticker de agentes) */}
      <div className="overflow-hidden border-b-2 border-inked bg-inked py-2.5">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[0, 1].map((k) => (
            <span key={k} className="flex items-center font-anton text-[15px] uppercase tracking-wider text-gold">
              {FEED_SCRIPT.slice(0, 8).map((ev, i) => (
                <span key={i} className="flex items-center">
                  <span>{AGENTS[ev.agent].label}</span>
                  <span className="mx-2 font-instrument text-[12.5px] font-medium normal-case tracking-normal text-paper/85">
                    {ev.text}
                  </span>
                  <span className="mx-5 text-paper/50">★</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* EL TABLÓN — portada asimétrica */}
      <section id="tablon" className="border-b-2 border-inked">
        <div className="mx-auto grid max-w-7xl gap-px bg-inked/15 lg:grid-cols-[1.3fr_1fr]">
          {/* nota principal */}
          <motion.article {...fadeUp} className="bg-paper px-6 py-12 lg:px-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-maroon">
              Cómo funciona
            </span>
            <h2 className="mt-4 font-anton text-[clamp(2rem,4.5vw,3.6rem)] uppercase leading-[0.98]">
              Un nutriólogo de guardia, todos los días del año.
            </h2>
            <div className="mt-8 space-y-7">
              {[
                ["01", "La consulta", "Le cuentas al agente qué corres y qué te duele lograr. Si tienes Strava, lo conectas (opcional); si no, con la charla basta."],
                ["02", "El dorsal", "Tu stack llega numerado y con porqué: qué tomar, cuánto, y la razón atada a tus kilómetros — nunca a una promesa."],
                ["03", "La temporada", "Cada mes la fórmula se recalcula con tu fase. ¿Lesión o descanso? Se pausa sola. Así corre un negocio honesto."],
              ].map(([n, t, d]) => (
                <div key={n} className="flex gap-5">
                  <span className="font-anton text-4xl leading-none text-gold">{n}</span>
                  <div>
                    <h3 className="font-anton text-xl uppercase tracking-wide">{t}</h3>
                    <p className="mt-1.5 max-w-lg text-[14.5px] leading-relaxed text-inked/65">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.article>

          {/* columna lateral */}
          <div className="flex flex-col gap-px">
            <motion.article
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="flex-1 bg-maroon px-8 py-10 text-paper"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                Resultados de la jornada
              </span>
              <div className="mt-6 space-y-5">
                {[
                  ["1,204", "decisiones tomadas por agentes hoy"],
                  ["92%", "de corredores siguen aquí a 30 días"],
                  ["7", "ventas rechazadas por seguridad esta semana"],
                ].map(([v, l]) => (
                  <div key={l} className="flex items-baseline gap-4 border-b border-paper/20 pb-4">
                    <span className="font-anton text-5xl text-gold">{v}</span>
                    <span className="text-[13px] leading-snug text-paper/80">{l}</span>
                  </div>
                ))}
              </div>
            </motion.article>
            <motion.article
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.18 }}
              className="bg-paper px-8 py-8"
            >
              <p className="font-iserif text-[19px] italic leading-snug text-inked/85">
                “Me quitó la creatina del carrito y me mandó con mi médico. Volví
                a la semana — y me quedé.”
              </p>
              <p className="mt-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-inked/50">
                Mariana G. · Maratón CDMX (testimonio mock)
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* DORSALES — productos */}
      <section id="dorsales" className="border-b-2 border-inked px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <motion.h2 {...fadeUp} className="font-anton text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.98]">
              Los dorsales<span className="text-maroon">.</span>
            </motion.h2>
            <motion.div {...fadeUp} className="max-w-sm">
              <p className="text-[13.5px] leading-relaxed text-inked/60">
                Diez productos, cada uno con su número. El agente decide cuáles
                corren contigo esta temporada — y cuáles se quedan en banca.
              </p>
              <Link
                href="/tienda?tema=editorial"
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-maroon transition hover:gap-2.5"
              >
                Ver catálogo completo <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </motion.div>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED.map((p, i) => (
              <motion.article
                key={p.slug}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="group relative border-2 border-inked bg-white p-6 transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#1A1714]"
              >
                <Link
                  href="/tienda?tema=editorial"
                  aria-label={`Ver ${p.name} en la tienda`}
                  className="absolute inset-0 z-10"
                />
                {/* imperdibles del dorsal */}
                {["left-3 top-3", "right-3 top-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
                  <span key={pos} aria-hidden className={`absolute ${pos} h-2 w-2 rounded-full border border-inked/40 bg-paper`} />
                ))}
                <div className="text-center">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-inked/50">
                    {p.category}
                  </span>
                  <div className="mt-2 font-anton text-[5.5rem] leading-none text-maroon transition group-hover:text-inked">
                    {p.bib}
                  </div>
                  <h3 className="mt-3 font-anton text-lg uppercase tracking-wide">{p.name}</h3>
                  <p className="mt-2 min-h-[60px] text-[12.5px] leading-relaxed text-inked/60">
                    {p.blurb}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-maroon">
                    {p.dose}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t-2 border-inked pt-4">
                    <span className="font-anton text-xl">{formatMXN(p.price)}</span>
                    <span className="bg-gold px-4 py-1.5 font-anton text-[13px] uppercase tracking-wider text-inked">
                      Ver en tienda
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* EL CLUB — manifiesto + agentes */}
      <section id="club" className="border-b-2 border-inked bg-maroon px-6 py-24 text-paper">
        <div className="mx-auto max-w-7xl">
          <motion.span {...fadeUp} className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
            El club de la venta honesta
          </motion.span>
          <motion.h2
            {...fadeUp}
            className="mt-5 max-w-3xl font-anton text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.98]"
          >
            Esta tienda la corren cinco agentes — y ninguno trabaja a comisión.
          </motion.h2>
          <div className="mt-12 grid gap-px bg-paper/20 sm:grid-cols-2 lg:grid-cols-5">
            {(Object.keys(AGENTS) as Array<keyof typeof AGENTS>).map((k, i) => (
              <motion.div
                key={k}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className="bg-maroon px-6 py-7"
              >
                <span className="font-anton text-3xl text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-anton text-lg uppercase tracking-wide">
                  {AGENTS[k].label}
                </h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-paper/70">
                  {k === "datos" && "Lee el entrenamiento de todos y levanta la mano cuando algo cambia."}
                  {k === "captacion" && "Escribe las historias que traen corredores nuevos al club."}
                  {k === "venta" && "Recomienda con porqué — y se niega a vender cuando hay riesgo."}
                  {k === "surtido" && "Que nunca falte tu electrolito el día de la tirada larga."}
                  {k === "retencion" && "Si dejas de correr, te cuida en vez de cobrarte."}
                </p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp} className="mt-10">
            <Link
              href="/consola?tema=editorial"
              className="inline-flex items-center gap-2 border-2 border-paper px-6 py-3 font-anton text-[14px] uppercase tracking-wider transition hover:bg-paper hover:text-maroon"
            >
              Verlos trabajar en vivo <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl text-center">
          <motion.p {...fadeUp} className="font-iserif text-xl italic text-inked/70">
            La línea de salida está más cerca de lo que crees.
          </motion.p>
          <motion.h2
            {...fadeUp}
            className="mx-auto mt-4 max-w-4xl font-anton text-[clamp(2.5rem,7vw,6rem)] uppercase leading-[0.95]"
          >
            Empieza tu <span className="text-maroon">temporada</span> hoy.
          </motion.h2>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <Link
              href="/consulta?tema=editorial"
              className="mt-10 inline-flex items-center gap-2.5 border-2 border-inked bg-inked px-8 py-4 font-anton text-[16px] uppercase tracking-wider text-paper transition hover:-translate-y-0.5 hover:bg-maroon hover:border-maroon"
            >
              Hablar con el agente <ArrowRight size={17} strokeWidth={2.5} />
            </Link>
          </motion.div>
          <p className="mt-8 text-[12px] text-inked/50">
            Información general y educativa. No sustituye consejo médico.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-inked px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-[12px] text-inked/55">
          <span className="font-anton text-lg uppercase tracking-wide text-inked">
            Rufias<span className="text-maroon">★</span>
          </span>
          <span>Prototipo demo · Strava simulado y opcional · Carrito simbólico</span>
          <Link href="/consola?tema=editorial" className="font-semibold uppercase tracking-[0.08em] transition hover:text-maroon">
            Consola ↗
          </Link>
        </div>
      </footer>
    </div>
  );
}
