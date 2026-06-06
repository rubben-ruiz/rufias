"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/* Comparador de propuestas de diseño para el equipo Rufias */

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] as const },
};

const PROPOSALS = [
  {
    href: "/propuestas/volt",
    tag: "A",
    name: "Volt Track",
    vibe: "Oscuro de alto contraste · acento verde eléctrico · tipografía de cartel deportivo",
    pitch:
      "Energía de marca de running performance (Nike Track, On). Máximo contraste y memorabilidad: la marca se ve rápida incluso quieta.",
    pros: [
      "El volt destaca en redes y en el video de 3 min",
      "Identidad fuerte, reconocible al instante",
      "El modo oscuro luce los datos: telemetría, consola, métricas en vivo",
    ],
    contras: ["Dark puede sentirse menos 'salud'", "Menos mainstream para conversión fría"],
  },
  {
    href: "/propuestas/lab",
    tag: "B",
    name: "Lab Wellness",
    vibe: "Claro y limpio · acento verde profundo · serif editorial con aire de laboratorio premium",
    pitch:
      "Estética clínica-editorial: evidencia, fichas de formulación, dosis. Transmite confianza y venta responsable — el argumento central del negocio.",
    pros: ["Refuerza 'evidencia y seguridad'", "Mainstream, conversión amplia", "Se ve premium sin gritar"],
    contras: ["Menos 'punch' deportivo", "Menor impacto visual en redes y video"],
  },
  {
    href: "/propuestas/editorial",
    tag: "C",
    name: "Editorial Sport",
    vibe: "Papel crema, burdeos y dorado · titulares de cartel retro · aire de revista de club de corredores",
    pitch:
      "Revista del club de corredores (Tracksmith × gaceta deportiva). Productos como dorsales, agentes como plantilla del club. Mucha personalidad de marca.",
    pros: ["La más diferenciada del mercado", "Storytelling natural para el video de 3 min", "Dorsales = sistema visual propio"],
    contras: ["Retro puede no leerse 'tech/IA'", "Más riesgosa de ejecutar consistente"],
  },
];

export default function Propuestas() {
  return (
    <div className="min-h-screen bg-coal px-6 py-16 font-archivo text-bone antialiased">
      <div className="mx-auto max-w-7xl">
        <motion.p {...fadeUp} className="text-[11px] font-bold tracking-[0.28em] text-volt">
          RUFIAS · UNA PROPUESTA DE DISEÑO
        </motion.p>
        <motion.h1
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.06 }}
          className="mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] font-black uppercase leading-[0.98]"
        >
          Una propuesta, tres direcciones.
        </motion.h1>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.12 }}
          className="mt-5 max-w-2xl text-[15px] leading-relaxed text-mute"
        >
          Esta es una de las propuestas del equipo. Explora el mismo contenido
          — hero, ticker de agentes en vivo, cómo funciona, catálogo, venta
          responsable y CTA — en tres direcciones visuales distintas, para
          evaluarlas en igualdad de condiciones junto a las demás propuestas.
        </motion.p>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PROPOSALS.map((p, i) => (
            <motion.article
              key={p.tag}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 + i * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface transition hover:-translate-y-1 hover:border-volt/40"
            >
              {/* mini-preview del estilo */}
              <Link href={p.href} className="block">
                {p.tag === "A" && (
                  <div className="flex h-44 flex-col justify-center bg-coal px-7">
                    <span className="text-[9px] font-bold tracking-[0.3em] text-volt">SOLO PARA CORREDORES</span>
                    <span className="mt-2 text-4xl font-black uppercase leading-[0.95]">
                      Corre.
                      <br />
                      <span className="text-volt">Repite.</span>
                    </span>
                  </div>
                )}
                {p.tag === "B" && (
                  <div className="flex h-44 flex-col justify-center bg-cream px-7 text-inkdeep">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-pine">
                      Suplementación para corredores
                    </span>
                    <span className="mt-2 font-fraunces text-3xl font-medium leading-tight tracking-tight">
                      La dosis correcta,
                      <br />
                      según <em className="text-pine">tu</em> entrenamiento.
                    </span>
                  </div>
                )}
                {p.tag === "C" && (
                  <div className="flex h-44 flex-col justify-center bg-paper px-7 text-inked">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-maroon">
                      La gaceta del corredor ★
                    </span>
                    <span className="mt-2 font-anton text-4xl uppercase leading-[0.95]">
                      Vuelve a salir
                      <br />
                      <span className="bg-maroon px-1.5 text-paper">a correr.</span>
                    </span>
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-volt text-[14px] font-black text-coal">
                    {p.tag}
                  </span>
                  <h2 className="text-xl font-extrabold">{p.name}</h2>
                </div>
                <p className="mt-2 text-[11.5px] font-bold tracking-wide text-mute">{p.vibe}</p>
                <p className="mt-4 text-[13.5px] leading-relaxed text-mute">{p.pitch}</p>
                <div className="mt-5 space-y-1.5">
                  {p.pros.map((x) => (
                    <p key={x} className="text-[12.5px] text-bone">
                      <span className="mr-2 font-bold text-volt">+</span>
                      {x}
                    </p>
                  ))}
                  {p.contras.map((x) => (
                    <p key={x} className="text-[12.5px] text-mute">
                      <span className="mr-2 font-bold">−</span>
                      {x}
                    </p>
                  ))}
                </div>
                <Link
                  href={p.href}
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-[14px] font-extrabold text-volt transition group-hover:gap-3"
                >
                  Ver landing completa <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.footer
          {...fadeUp}
          className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-[13px] text-mute"
        >
          <span>
            También puedes ir directo a una superficie:{" "}
            <Link href="/" className="font-semibold text-bone underline-offset-4 hover:underline">
              consulta
            </Link>{" "}
            ·{" "}
            <Link href="/tienda" className="font-semibold text-bone underline-offset-4 hover:underline">
              tienda
            </Link>{" "}
            ·{" "}
            <Link href="/carrito" className="font-semibold text-bone underline-offset-4 hover:underline">
              carrito
            </Link>{" "}
            ·{" "}
            <Link href="/consola" className="font-semibold text-bone underline-offset-4 hover:underline">
              consola
            </Link>
          </span>
          <span className="inline-flex items-center gap-1.5">
            Hackathon «90 days» · AI-native ops <ArrowUpRight size={13} />
          </span>
        </motion.footer>
      </div>
    </div>
  );
}
