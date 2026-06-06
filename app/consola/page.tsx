"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, HeartHandshake, Play } from "lucide-react";
import type { Message, RetentionResult } from "@/lib/types";
import { AGENTS, FEED_SCRIPT, type AgentKey, type FeedEvent } from "@/lib/agents";
import {
  CONTAINER,
  THEMES,
  cardClass,
  displayClass,
  pillClass,
  readTema,
  type Tema,
} from "@/lib/themes";

// Colores de agente legibles por tema (los neón no funcionan sobre claro)
const AGENT_LIGHT: Record<AgentKey, string> = {
  datos: "#6e6e64",
  captacion: "#2f6cb3",
  venta: "#4d7c1f",
  surtido: "#a96f0e",
  retencion: "", // usa el acento del tema
};

/* ──────────────────────────────────────────────
   Agente de retención (IA real vía /api/ai)
   ────────────────────────────────────────────── */
type RetentionCase = { id: string; customer: string; signal: string };

const CASES: RetentionCase[] = [
  {
    id: "C-1041",
    customer: "Mariana G.",
    signal:
      "Maratonista. Compraba electrolitos cada 4 semanas; lleva 7 sin comprar y su volumen en Strava bajó 40%. Última conversación: mencionó molestia en la rodilla.",
  },
  {
    id: "C-0877",
    customer: "Diego R.",
    signal:
      "Pausó su suscripción de proteína justo después de su maratón hace 5 semanas. En Strava ya volvió a correr 3 veces por semana, volumen suave.",
  },
  {
    id: "C-1190",
    customer: "Sofía L.",
    signal:
      "Compró su stack inicial hace 30 días y no ha recomprado. Sus tiradas largas subieron de 14 a 20 km. Abrió el último correo dos veces.",
  },
];

const RETENTION_SYSTEM = `Eres el agente de retención de Rufias, tienda de nutrición deportiva para corredores. Operas de forma autónoma con un principio: cuidar al corredor, NUNCA presionar la venta. Tono cálido, humano, en español.

Recibirás la señal de un cliente. Decide qué hacer. Si la señal sugiere lesión, molestia o pausa del entrenamiento, prioriza pausar/reducir su plan y mostrar cuidado genuino — sin vender. Vender menos hoy está bien si el cliente está mejor.

Responde SOLO con JSON válido, sin markdown ni texto extra, exactamente así:
{"detecto": "qué detectaste en la señal", "decision": "qué decides hacer", "ajuste": "ajuste concreto al plan/pedido (puede ser pausar o reducir)", "mensaje": "el mensaje cálido y breve que enviarías al cliente, en primera persona"}`;

const FALLBACK_RESULT: RetentionResult = {
  detecto: "Cambio en el patrón de compra y de entrenamiento del cliente.",
  decision: "Pausar la cadencia de pedidos y escribirle sin intención de venta.",
  ajuste: "Suscripción en pausa 4 semanas; sin cargos ni envíos en ese periodo.",
  mensaje:
    "Hola — noté que has corrido distinto últimamente. Pausé tu próximo envío para que no te llegue nada que no necesites. Si algo cambió (¡o si todo va bien!), cuéntame y lo ajustamos juntos. Aquí estoy.",
};

async function callAI(system: string, messages: Message[]): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, messages }),
  });
  const data = (await res.json()) as { text?: string };
  return (data.text || "").trim();
}

function parseRetention(raw: string): RetentionResult | null {
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    const obj = JSON.parse(cleaned.slice(start, end + 1)) as Partial<
      Record<keyof RetentionResult, unknown>
    >;
    if (!obj.detecto || !obj.mensaje) return null;
    return {
      detecto: String(obj.detecto),
      decision: String(obj.decision ?? ""),
      ajuste: String(obj.ajuste ?? ""),
      mensaje: String(obj.mensaje),
    };
  } catch {
    return null;
  }
}

/* ──────────────────────────────────────────────
   Página
   ────────────────────────────────────────────── */
type Decision = { caseData: RetentionCase; result: RetentionResult; live: boolean };

export default function Consola() {
  const [tema, setTema] = useState<Tema>("volt");
  const [feed, setFeed] = useState<Array<FeedEvent & { ts: string }>>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [caseIdx, setCaseIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [kpi, setKpi] = useState({ pedidos: 47, stacks: 31, retencion: 92, derivados: 6 });
  const feedRef = useRef<HTMLDivElement>(null);
  const scriptIdx = useRef(0);

  useEffect(() => {
    setTema(readTema());
  }, []);

  // Feed simulado: un evento nuevo cada ~2.4s, en loop
  useEffect(() => {
    const tick = () => {
      const ev = FEED_SCRIPT[scriptIdx.current % FEED_SCRIPT.length];
      scriptIdx.current += 1;
      const ts = new Date().toLocaleTimeString("es-MX", { hour12: false });
      setFeed((f) => [...f.slice(-30), { ...ev, ts }]);
    };
    tick();
    const id = setInterval(tick, 2400);
    return () => clearInterval(id);
  }, []);

  // KPIs con movimiento suave para sensación de vivo
  useEffect(() => {
    const id = setInterval(() => {
      setKpi((k) => ({
        pedidos: k.pedidos + (Math.random() < 0.4 ? 1 : 0),
        stacks: k.stacks + (Math.random() < 0.3 ? 1 : 0),
        retencion: Math.min(97, Math.max(88, k.retencion + (Math.random() < 0.5 ? 1 : -1))),
        derivados: k.derivados + (Math.random() < 0.12 ? 1 : 0),
      }));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [feed]);

  async function runCase(idx: number) {
    if (running || idx >= CASES.length) return;
    const c = CASES[idx];
    setRunning(true);
    try {
      const raw = await callAI(RETENTION_SYSTEM, [
        { role: "user", content: `Señal del cliente ${c.customer} (${c.id}): ${c.signal}` },
      ]);
      const parsed = parseRetention(raw);
      setDecisions((d) => [{ caseData: c, result: parsed ?? FALLBACK_RESULT, live: !!parsed }, ...d]);
    } catch {
      setDecisions((d) => [{ caseData: c, result: FALLBACK_RESULT, live: false }, ...d]);
    } finally {
      setRunning(false);
      setCaseIdx(idx + 1);
    }
  }

  // Sin auto-arranque: el agente de retención (IA real) solo corre con clic
  // explícito, para no consumir la API key al abrir la consola.

  const agentColor = (k: AgentKey) =>
    tema === "volt"
      ? AGENTS[k].color
      : k === "retencion"
        ? "var(--c-accent)"
        : AGENT_LIGHT[k];

  // Tipografía display y radios según el tema (compartidos en lib/themes)
  const display = displayClass(tema);
  const card = cardClass(tema);
  const pill = pillClass(tema);

  const KPIS: Array<{ label: string; value: string; key?: boolean }> = [
    { label: "Pedidos hoy", value: String(kpi.pedidos) },
    { label: "Stacks generados", value: String(kpi.stacks) },
    { label: "Retención 30d", value: `${kpi.retencion}%`, key: true },
    { label: "Derivados a médico", value: String(kpi.derivados) },
  ];

  return (
    <div
      style={THEMES[tema]}
      className="flex min-h-screen flex-col bg-[var(--c-bg)] font-instrument text-[var(--c-text)] antialiased"
    >
      {/* NAV */}
      <header className={`${CONTAINER} flex items-center justify-between border-b border-[var(--c-line)] py-4`}>
        <div className="flex items-center gap-3">
          <Link
            href={`/?tema=${tema}`}
            aria-label="Volver a la tienda"
            className={`grid h-9 w-9 place-items-center border border-[var(--c-line)] ${pill} text-[var(--c-muted)] transition hover:text-[var(--c-accent)]`}
          >
            <ArrowLeft size={15} />
          </Link>
          <Link
            href={`/propuestas/${tema}`}
            className={`${display} text-lg tracking-wide transition hover:text-[var(--c-accent)]`}
          >
            RUFIAS
          </Link>
          <span
            className={`${pill} bg-[var(--c-accent)] px-2.5 py-1 text-[10px] font-extrabold tracking-[0.12em] text-[var(--c-onaccent)]`}
          >
            OPS
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-[12px] font-semibold text-[var(--c-muted)]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--c-accent)]" />
          En vivo · demo
        </div>
      </header>

      {/* HERO */}
      <section className={`${CONTAINER} pb-7 pt-9`}>
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--c-accent)]">
          Consola de operación
        </p>
        <h1 className={`${display} mt-3 text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.98]`}>
          La tienda se opera <span className="text-[var(--c-accent)]">sola.</span>
        </h1>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {(Object.keys(AGENTS) as AgentKey[]).map((k) => (
            <span
              key={k}
              className={`inline-flex items-center gap-2 border border-[var(--c-line)] ${pill} px-3.5 py-1.5 text-[12px] font-semibold text-[var(--c-muted)]`}
            >
              <i
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ background: agentColor(k) }}
              />
              {AGENTS[k].label}
            </span>
          ))}
        </div>
      </section>

      {/* KPIs */}
      <section className={`${CONTAINER} grid grid-cols-2 gap-3 lg:grid-cols-4`}>
        {KPIS.map((k) => (
          <article
            key={k.label}
            className={`${card} border-[var(--c-line)] bg-[var(--c-surface)] px-5 py-4`}
          >
            <small className="block text-[11px] font-semibold text-[var(--c-muted)]">
              {k.label}
            </small>
            <b
              className={`${display} mt-1 block text-3xl ${
                k.key ? "text-[var(--c-accent)] lg:text-4xl" : ""
              }`}
            >
              {k.value}
            </b>
          </article>
        ))}
      </section>

      {/* GRID PRINCIPAL */}
      <main className={`${CONTAINER} grid flex-1 items-start gap-4 py-5 lg:grid-cols-[1fr_1.1fr]`}>
        {/* Feed de agentes */}
        <section
          className={`${card} flex flex-col overflow-hidden border-[var(--c-line)] bg-[var(--c-surface)]`}
        >
          <header className="flex items-center gap-2.5 border-b border-[var(--c-line)] px-5 py-4">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em]">
              Agentes operando
            </span>
            <span
              className={`ml-auto border border-[var(--c-line)] ${pill} px-2.5 py-1 text-[10px] font-semibold text-[var(--c-muted)]`}
            >
              Simulado
            </span>
          </header>
          <div
            ref={feedRef}
            className="flex h-[56vh] min-h-[420px] flex-col gap-3 overflow-y-auto px-5 py-4"
          >
            {feed.map((ev, i) => (
              <motion.div
                key={`${i}-${ev.ts}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-[58px_96px_1fr] items-start gap-2.5"
              >
                <span className="pt-1 text-[11px] font-semibold text-[var(--c-muted)]">
                  {ev.ts}
                </span>
                <span
                  className={`inline-flex justify-self-start whitespace-nowrap border ${pill} px-2.5 py-0.5 text-[10.5px] font-extrabold`}
                  style={{ color: agentColor(ev.agent), borderColor: agentColor(ev.agent) }}
                >
                  {AGENTS[ev.agent].label}
                </span>
                <p className="text-[13.5px] leading-relaxed">{ev.text}</p>
              </motion.div>
            ))}
            <span className="ml-[68px] h-3.5 w-2 animate-pulse bg-[var(--c-accent)]" />
          </div>
        </section>

        {/* Agente de retención con IA real */}
        <section
          className={`${card} flex flex-col overflow-hidden border-[var(--c-line)] bg-[var(--c-surface)]`}
        >
          <header className="flex items-center gap-2.5 border-b border-[var(--c-line)] px-5 py-4">
            <HeartHandshake size={15} className="text-[var(--c-accent)]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em]">
              Agente de retención
            </span>
            <span
              className={`ml-auto border border-[var(--c-accent)] ${pill} px-2.5 py-1 text-[10px] font-bold text-[var(--c-accent)]`}
            >
              IA real
            </span>
          </header>

          <div className="flex max-h-[56vh] min-h-[420px] flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
            {decisions.length === 0 && !running && (
              <p className="py-10 text-center text-[14px] text-[var(--c-muted)]">
                3 señales de clientes en cola. Presiona «Procesar siguiente señal»
                para ver al agente decidir en vivo (usa IA real).
              </p>
            )}

            {running && (
              <div className="flex items-center gap-3 py-2 text-[14px] text-[var(--c-muted)]">
                <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-[var(--c-line)] border-t-[var(--c-accent)]" />
                Analizando señal de {CASES[Math.min(caseIdx, CASES.length - 1)].customer}…
              </div>
            )}

            {decisions.map((d) => (
              <motion.article
                key={d.caseData.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${card} border-[var(--c-line)] bg-[var(--c-surface2)] p-4`}
              >
                <header className="mb-2 flex items-center gap-2.5">
                  <b className="text-[15px] font-extrabold">{d.caseData.customer}</b>
                  <span className="text-[12px] font-semibold text-[var(--c-muted)]">
                    {d.caseData.id}
                  </span>
                  {!d.live && (
                    <span
                      className={`border border-[var(--c-line)] ${pill} px-2 py-0.5 text-[10px] font-semibold text-[var(--c-muted)]`}
                    >
                      Fallback
                    </span>
                  )}
                </header>
                <p className="mb-3 text-[13px] leading-relaxed text-[var(--c-muted)]">
                  {d.caseData.signal}
                </p>
                <dl className="mb-3 space-y-2.5">
                  {(
                    [
                      ["Detectó", d.result.detecto],
                      ["Decisión", d.result.decision],
                      ["Ajuste", d.result.ajuste],
                    ] as const
                  ).map(([t, v]) => (
                    <div key={t}>
                      <dt className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-[var(--c-accent)]">
                        {t}
                      </dt>
                      <dd className="mt-0.5 text-[13.5px] leading-relaxed">{v}</dd>
                    </div>
                  ))}
                </dl>
                <blockquote className="border-l-[3px] border-[var(--c-accent)] bg-[var(--c-surface)] px-3.5 py-3">
                  <small className="mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-[var(--c-accent)]">
                    Mensaje al cliente
                  </small>
                  <span className="text-[14px] leading-relaxed">{d.result.mensaje}</span>
                </blockquote>
              </motion.article>
            ))}
          </div>

          {caseIdx < CASES.length && !running && (
            <button
              onClick={() => runCase(caseIdx)}
              className={`mx-5 mb-4 inline-flex items-center justify-center gap-2 ${pill} bg-[var(--c-accent)] py-3.5 text-[14px] font-extrabold text-[var(--c-onaccent)] transition hover:-translate-y-px hover:bg-[var(--c-accent2)]`}
            >
              <Play size={14} strokeWidth={2.5} /> Procesar siguiente señal (
              {CASES.length - caseIdx} en cola)
            </button>
          )}
          {caseIdx >= CASES.length && !running && (
            <p className="pb-4 text-center text-[13px] font-extrabold text-[var(--c-accent)]">
              Cola de retención al día ✓
            </p>
          )}
        </section>
      </main>

      <footer className="px-6 pb-6 text-center text-[11.5px] text-[var(--c-muted)]">
        Prototipo demo. Información general y educativa; no sustituye consejo médico.
      </footer>
    </div>
  );
}
