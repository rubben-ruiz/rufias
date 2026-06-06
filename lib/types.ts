// Tipos compartidos de Rufias

export type Role = "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
}

export interface StackItem {
  name: string;
  why: string;
  dose: string;
}

export interface Stack {
  match: number; // 0-100, qué tan ajustado quedó el stack al perfil
  items: StackItem[];
  safety: string; // nota de seguridad visible junto al stack
}

export interface RetentionResult {
  detecto: string; // qué detectó el agente en la señal del cliente
  decision: string; // qué decidió hacer
  ajuste: string; // ajuste concreto al plan/pedido
  mensaje: string; // mensaje cálido que se enviaría al cliente
}

// Resumen mock de Strava que alimenta al agente (demo, sin OAuth real)
export interface TrainingSummary {
  source: string;
  weeklyKm: number;
  trend: string; // variación de carga en el último mes
  pace: string; // min/km
  longRun: string;
  elevation: string; // desnivel semanal
  avgHr: number;
  sessions: number;
  phase: string; // fase de entrenamiento
}
