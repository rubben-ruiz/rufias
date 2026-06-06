// Taxonomía de agentes de Rufias y feed simulado de operación.
// Compartido por la consola y los tickers "operado por agentes" de las landings.

export type AgentKey = "datos" | "captacion" | "venta" | "surtido" | "retencion";

export const AGENTS: Record<AgentKey, { label: string; color: string }> = {
  datos: { label: "Datos", color: "#9c9c96" },
  captacion: { label: "Captación", color: "#5ba0e8" },
  venta: { label: "Venta", color: "#a6d365" },
  surtido: { label: "Surtido", color: "#efb23c" },
  retencion: { label: "Retención", color: "#cdff47" },
};

export type FeedEvent = { agent: AgentKey; text: string };

export const FEED_SCRIPT: FeedEvent[] = [
  { agent: "datos", text: "Sincronizadas 214 cuentas de Strava. 12 corredores subieron carga >15% esta semana." },
  { agent: "captacion", text: "Campaña «tirada larga de domingo» en IG: CTR 2.1%, 38 visitas nuevas a la landing." },
  { agent: "venta", text: "Stack generado para corredora de 10K: match 94%, 3 items, sin señales de riesgo." },
  { agent: "surtido", text: "Electrolitos cítrico a 41 uds. Punto de reorden en 35 → orden de compra preparada." },
  { agent: "retencion", text: "Escaneando señales de 132 suscripciones activas…" },
  { agent: "venta", text: "Cliente mencionó hipertensión → derivado a profesional de salud. Venta no realizada, a propósito." },
  { agent: "datos", text: "Caída de volumen de 40% detectada en C-1041 (Mariana G.) → señal enviada a retención." },
  { agent: "captacion", text: "A/B del hero: «a tu ritmo» supera a «rinde más» 1.8x en CTR. Variante promovida." },
  { agent: "surtido", text: "Lote #4412 de magnesio llega mañana 10:00. 18 uds reservadas para suscripciones." },
  { agent: "retencion", text: "Caso C-0877 en cola: pausa post-maratón con regreso suave al volumen." },
  { agent: "venta", text: "Carrito recuperado con un recordatorio sin descuento. Cliente completó su pedido." },
  { agent: "datos", text: "Rotación de omega-3 +22% esta semana. Pronóstico de demanda actualizado." },
  { agent: "surtido", text: "Proveedor confirmó OC #208: 120 uds de electrolitos, llegada en 4 días." },
  { agent: "captacion", text: "Guía corta publicada: «Sodio por hora en rodajes largos», enlazada a 3 productos." },
];
