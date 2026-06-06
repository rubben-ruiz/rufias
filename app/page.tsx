"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  Link2,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";
import type { Message, Stack, TrainingSummary } from "@/lib/types";
import { CATALOG } from "@/lib/catalog";
import { readCart, writeCart } from "@/lib/cart";
import {
  CONTAINER,
  THEMES,
  cardClass,
  displayClass,
  pillClass,
  readTema,
  type Tema,
} from "@/lib/themes";

/* ──────────────────────────────────────────────
   Agente nutriólogo: prompts (port del prototipo)
   ────────────────────────────────────────────── */
const BASE_SYSTEM = `Eres el agente nutriólogo de Rufias, una tienda de suplementos dedicada solo a corredores.
Hablas natural, cálido y deportivo, BREVE: una sola pregunta a la vez, en 1-3 frases.
Tu meta es entender: (1) qué quiere lograr el corredor, (2) su tipo y volumen de entrenamiento, (3) posibles riesgos: alergias, condiciones médicas, embarazo o medicamentos.
Eres responsable: NUNCA diagnosticas, no haces promesas médicas, manejas dosis dentro de rangos generales y seguros, y si detectas una condición médica, embarazo o medicamentos, recomiendas consultar a un profesional ANTES de cualquier suplemento.
No recomiendes productos en el chat todavía: solo recopila información. Cuando ya tengas objetivo + entrenamiento + posibles restricciones, dilo en una frase e invita a generar el stack.
Responde siempre en español.`;

const STRAVA_SUMMARY: TrainingSummary = {
  source: "Strava",
  weeklyKm: 42,
  trend: "+18%",
  pace: "5:30",
  longRun: "21 km",
  elevation: "320 m",
  avgHr: 152,
  sessions: 5,
  phase: "Base de volumen",
};

function buildSystem(s: TrainingSummary | null): string {
  if (!s) return BASE_SYSTEM;
  return (
    BASE_SYSTEM +
    `\n\nDATOS REALES DE ENTRENAMIENTO (vía ${s.source}): ${s.weeklyKm} km/semana (carga ${s.trend} en el último mes), ritmo ${s.pace}/km, tirada larga ${s.longRun}, desnivel ${s.elevation}/sem, FC media ${s.avgHr}, ${s.sessions} sesiones/sem, fase "${s.phase}". Ya conoces su volumen y tipo de entrenamiento: NO los preguntes. Menciónalos para personalizar y ten en cuenta que la subida de carga eleva el riesgo de estrés óseo/tendinoso. Aún confirma objetivo y restricciones (alergias, condiciones, medicamentos).`
  );
}

const STACK_INSTRUCTION = `Con base en TODA nuestra conversación (y en los datos de entrenamiento si los hay), genera mi stack de suplementos para correr.
Responde SOLO con JSON válido, sin markdown ni texto extra, con esta forma exacta:
{"match": <número 90-99>, "items": [{"name": "<nombre>", "why": "<una frase atada a su entrenamiento>", "dose": "<dosis general y segura>"}], "safety": "<recordatorio breve de seguridad>"}
Incluye de 3 a 4 items. Mantén dosis en rangos generales y seguros.`;

const FALLBACK_STACK: Stack = {
  match: 96,
  items: [
    {
      name: "Vitamina D3 + K2",
      why: "Tu carga subió 18%: refuerza el hueso para prevenir fracturas por estrés.",
      dose: "1000–2000 UI al día",
    },
    {
      name: "Magnesio (glicinato)",
      why: "Apoya recuperación y sueño en plena fase de volumen.",
      dose: "200–300 mg por la noche",
    },
    {
      name: "Electrolitos",
      why: "Repone sodio y potasio en tus tiradas largas de 21 km.",
      dose: "1 sobre en rodajes > 60 min",
    },
    {
      name: "Omega-3 (EPA/DHA)",
      why: "Modula la inflamación y cuida tendones y articulaciones.",
      dose: "1–2 g al día con comida",
    },
  ],
  safety:
    "Rangos generales y educativos. Consulta a tu médico antes de iniciar cualquier suplemento, en especial si tienes alguna condición o tomas medicamentos.",
};

const GREETING =
  "Hola, soy tu agente de Rufias. Voy a armarte un stack a tu medida y seguro. Para empezar: ¿qué quieres lograr ahora mismo con tu entrenamiento?";
const STRAVA_ACK =
  "Listo, ya leí tu Strava: 42 km por semana, +18% de carga en el último mes y tirada larga de 21 km, en plena fase de volumen. Con esto afino tu stack — sigamos.";

function parseStack(raw: string): Stack | null {
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    const parsed = JSON.parse(cleaned.slice(start, end + 1)) as Stack;
    return parsed && parsed.items?.length ? parsed : null;
  } catch {
    return null;
  }
}

/* ──────────────────────────────────────────────
   Página (Tailwind + temas compartidos)
   ────────────────────────────────────────────── */
// Agent-first: la consulta abre directo en el chat. Strava es un chip
// opcional dentro del chat — cero pantallas intermedias.
type Step = "chat" | "stack";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] as const },
};

export default function RufiasPrototype() {
  const [step, setStep] = useState<Step>("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(12);
  const [stack, setStack] = useState<Stack | null>(null);
  const [generating, setGenerating] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  const [summary, setSummary] = useState<TrainingSummary | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [tema, setTema] = useState<Tema>("volt");
  const endRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // La consulta hereda la piel de la propuesta desde la que llegas (?tema=)
  useEffect(() => {
    setTema(readTema());
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Toda llamada a la IA pasa por el proxy server-side /api/ai
  async function callAI(history: Message[]): Promise<string> {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: buildSystem(summary), messages: history }),
    });
    const data = (await res.json()) as { text?: string };
    return (data.text || "").trim();
  }

  const apiHistory = (msgs: Message[]) =>
    msgs[0]?.role === "assistant" ? msgs.slice(1) : msgs;

  // Strava simulado y opcional: se conecta desde un chip dentro del chat
  async function connectStrava() {
    if (connecting || summary) return;
    setConnecting(true);
    await new Promise((r) => setTimeout(r, 1300));
    setSummary(STRAVA_SUMMARY);
    setMessages((m) => [...m, { role: "assistant", content: STRAVA_ACK }]);
    setProgress((p) => Math.max(p, 48));
    setConnecting(false);
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setProgress((p) => Math.min(summary ? 88 : 85, p + (summary ? 13 : 19)));
    try {
      const reply = await callAI(apiHistory(next));
      setMessages([
        ...next,
        { role: "assistant", content: reply || "¿Me cuentas un poco más?" },
      ]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Se me cruzaron los cables un segundo. ¿Lo intentamos de nuevo?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function generateStack() {
    setGenerating(true);
    try {
      const history: Message[] = [
        ...apiHistory(messages),
        { role: "user", content: STACK_INSTRUCTION },
      ];
      const raw = await callAI(history);
      setStack(parseStack(raw) ?? FALLBACK_STACK);
    } catch {
      setStack(FALLBACK_STACK);
    } finally {
      setGenerating(false);
      setProgress((p) => Math.max(p, 96));
      setStep("stack");
    }
  }

  // Mapea los items del stack (nombres libres de la IA) al catálogo y
  // los pasa al carrito compartido de /tienda y /carrito.
  function goToCart() {
    if (cart.length === 0) return;
    const norm = (s: string) =>
      s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const current = readCart();
    for (const name of cart) {
      const n = norm(name);
      const match = CATALOG.find((p) => {
        const pn = norm(p.name);
        return n.includes(pn.split(" ")[0]) || pn.includes(n.split(" ")[0]);
      });
      if (match) current[match.slug] = (current[match.slug] ?? 0) + 1;
    }
    writeCart(current);
    router.push(`/carrito?tema=${tema}`);
  }

  function reset() {
    setMessages([{ role: "assistant", content: GREETING }]);
    setProgress(12);
    setStack(null);
    setCart([]);
    setInput("");
    setSummary(null);
    setStep("chat");
  }

  const userTurns = messages.filter((m) => m.role === "user").length;
  const canGenerate = userTurns >= (summary ? 2 : 3) && !loading;
  const metrics: Array<[string, string]> = summary
    ? [
        [`${summary.weeklyKm} km`, "por semana"],
        [summary.trend, "de carga"],
        [`${summary.pace}`, "ritmo /km"],
        [summary.phase, "fase"],
      ]
    : [];

  // Recetas de clases tematizadas
  const display = displayClass(tema);
  const card = `${cardClass(tema)} border-[var(--c-line)]`;
  const pill = pillClass(tema);
  const bodyFont = tema === "volt" ? "font-archivo" : "font-instrument";
  const btn = `inline-flex items-center justify-center gap-2 ${pill} bg-[var(--c-accent)] font-extrabold text-[var(--c-onaccent)] transition hover:-translate-y-px hover:bg-[var(--c-accent2)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0`;
  const ghost = `inline-flex items-center justify-center ${pill} border border-[var(--c-line)] font-semibold text-[var(--c-muted)] transition hover:border-[var(--c-accent)] hover:text-[var(--c-text)] disabled:opacity-60`;
  const eyebrow = "text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--c-accent)]";
  const inputCls = `${tema === "editorial" ? "rounded-none" : "rounded-xl"} w-full border border-[var(--c-line)] bg-[var(--c-surface2)] px-4 py-3 text-[15px] text-[var(--c-text)] outline-none transition placeholder:text-[var(--c-muted)] focus:border-[var(--c-accent)]`;

  return (
    <div
      style={THEMES[tema]}
      className={`min-h-screen bg-[var(--c-bg)] text-[var(--c-text)] ${bodyFont} tracking-[-0.01em] antialiased`}
    >
      <div className={`${CONTAINER} py-6`}>
        {/* TOPBAR */}
        <div className="flex items-center justify-between pb-5">
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
              href={`/consola?tema=${tema}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--c-muted)] transition hover:text-[var(--c-accent)]"
            >
              Consola de operación <ArrowUpRight size={13} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* ── CHAT (entrada directa, agent-first) ── */}
        {step === "chat" && (
          <div
            className={`${card} flex h-[min(760px,calc(100vh-150px))] min-h-[560px] flex-col overflow-hidden bg-[var(--c-surface)]`}
          >
            <div className="border-b border-[var(--c-line)] px-6 pb-4 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <Link
                  href={`/propuestas/${tema}`}
                  className={`${display} tracking-wide transition hover:text-[var(--c-accent)]`}
                >
                  RUFIAS
                </Link>
                <span className="text-[13px] font-semibold text-[var(--c-muted)]">
                  Match{" "}
                  <span className="font-extrabold text-[var(--c-accent)]">{progress}%</span>
                </span>
              </div>
              <div className={`h-1.5 overflow-hidden ${pill} bg-[var(--c-surface2)]`}>
                <div
                  className={`h-full ${pill} bg-[var(--c-accent)] transition-[width] duration-700 ease-out`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {summary ? (
              <div className="border-b border-[var(--c-line)] bg-[var(--c-surface2)] px-6 py-3.5">
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-[2px] bg-strava" />
                  <span className="text-[11px] font-extrabold tracking-[0.08em] text-strava">
                    STRAVA CONECTADO
                  </span>
                </div>
                <div className="flex flex-wrap gap-6">
                  {metrics.map(([v, l]) => (
                    <div key={l}>
                      <div className="text-sm font-extrabold">{v}</div>
                      <div className="text-[11px] text-[var(--c-muted)]">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 border-b border-[var(--c-line)] bg-[var(--c-surface2)] px-6 py-3">
                <button
                  onClick={connectStrava}
                  disabled={connecting}
                  className={`inline-flex items-center gap-2 ${pill} bg-strava px-4 py-2 text-xs font-extrabold text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70`}
                >
                  {connecting ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" /> Conectando…
                    </>
                  ) : (
                    <>
                      <Link2 size={13} strokeWidth={2.5} /> Conectar Strava
                    </>
                  )}
                </button>
                <span className="text-[11px] leading-snug text-[var(--c-muted)]">
                  Opcional — afina tu stack con tus datos reales. Demo simulada,
                  no usa tu cuenta.
                </span>
              </div>
            )}

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`max-w-[min(82%,680px)] ${m.role === "user" ? "self-end" : "self-start"}`}
                >
                  <div
                    className={
                      m.role === "user"
                        ? `bg-[var(--c-accent)] px-4 py-3 text-[15px] font-semibold leading-relaxed text-[var(--c-onaccent)] ${
                            tema === "editorial"
                              ? "rounded-none"
                              : "rounded-[18px] rounded-br-[4px]"
                          }`
                        : `border border-[var(--c-line)] bg-[var(--c-surface2)] px-4 py-3 text-[15px] leading-relaxed ${
                            tema === "editorial"
                              ? "rounded-none"
                              : "rounded-[18px] rounded-bl-[4px]"
                          }`
                    }
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div
                  className={`flex gap-1.5 self-start border border-[var(--c-line)] bg-[var(--c-surface2)] px-4 py-3.5 ${
                    tema === "editorial" ? "rounded-none" : "rounded-[18px] rounded-bl-[4px]"
                  }`}
                >
                  {[0, 0.2, 0.4].map((d) => (
                    <span
                      key={d}
                      className="h-[7px] w-[7px] animate-pulse rounded-full bg-[var(--c-accent)]"
                      style={{ animationDelay: `${d}s` }}
                    />
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-[var(--c-line)] p-4">
              {canGenerate && (
                <button
                  onClick={generateStack}
                  disabled={generating}
                  className={`${btn} mb-3 w-full py-3.5 text-[15px]`}
                >
                  {generating ? (
                    "Armando tu stack…"
                  ) : (
                    <>
                      Generar mi stack <Sparkles size={16} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              )}
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  value={input}
                  placeholder="Escribe tu respuesta…"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  aria-label="Enviar"
                  className={`${btn} px-5`}
                >
                  <Send size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STACK ── */}
        {step === "stack" && stack && (
          <motion.div
            {...fadeUp}
            className={`${card} bg-[var(--c-surface)] px-7 py-11 sm:px-14`}
          >
            <div className={eyebrow}>Tu fórmula personalizada</div>
            <div className="mt-2 flex items-end gap-3">
              <span
                className={`${display} text-[clamp(64px,8vw,92px)] leading-none text-[var(--c-accent)]`}
              >
                {stack.match}%
              </span>
              <span className="pb-2.5 font-semibold text-[var(--c-muted)]">
                de match con tu perfil
              </span>
            </div>
            {summary && (
              <div className="mt-1 flex items-center gap-2 text-xs text-[var(--c-muted)]">
                <span className="h-[7px] w-[7px] rounded-[2px] bg-strava" /> Basado en tus
                datos de Strava
              </div>
            )}

            <div className="mt-7 grid gap-3.5 md:grid-cols-2">
              {stack.items.map((it, i) => {
                const added = cart.includes(it.name);
                return (
                  <motion.div
                    key={it.name}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className={`${card} bg-[var(--c-surface2)] p-4`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-[16px] font-extrabold">{it.name}</div>
                      <button
                        onClick={() =>
                          setCart(
                            added ? cart.filter((c) => c !== it.name) : [...cart, it.name]
                          )
                        }
                        aria-label="Agregar al carrito"
                        className={`${added ? ghost : btn} shrink-0 gap-1.5 px-2.5 py-1.5 text-xs`}
                      >
                        {added ? (
                          <>
                            <Check size={13} strokeWidth={3} /> Listo
                          </>
                        ) : (
                          <>
                            <Plus size={13} strokeWidth={3} /> Agregar
                          </>
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--c-muted)]">
                      {it.why}
                    </p>
                    <div className="mt-2.5 text-xs font-bold tracking-[0.02em] text-[var(--c-accent)]">
                      {it.dose}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div
              className={`${card} mt-4 flex gap-2.5 bg-[var(--c-surface2)] p-3.5`}
            >
              <RefreshCw
                size={16}
                className="mt-0.5 shrink-0 text-[var(--c-accent)]"
                strokeWidth={2.2}
              />
              <p className="text-[13px] leading-relaxed text-[var(--c-muted)]">
                <span className="font-bold text-[var(--c-text)]">Tu stack evoluciona.</span>{" "}
                Cada mes se reajusta según tus datos de Strava y tu fase de entrenamiento.
              </p>
            </div>

            <button
              onClick={goToCart}
              disabled={cart.length === 0}
              className={`${btn} mt-4 w-full py-4 text-[16px]`}
            >
              {cart.length === 0
                ? "Agrega algo a tu carrito"
                : `Ir al carrito (${cart.length})`}
            </button>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-[var(--c-muted)]">
              {stack.safety || "Información general y educativa. No sustituye consejo médico."}
            </p>
            <button
              onClick={reset}
              className={`${ghost} mx-auto mt-4 block px-4 py-2 text-[13px]`}
            >
              Empezar de nuevo
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
