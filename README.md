# Rufias — Nutrición deportiva operada por IA

Prototipo de tienda de nutrición deportiva para corredores **operada por agentes de IA**. Next.js (App Router) + TypeScript.

Dos superficies:

- **`/`** — Flujo del cliente: landing → "Conectar Strava" (simulado) → consulta conversacional con el agente nutriólogo → stack personalizado con su porqué + carrito simbólico.
- **`/consola`** — Consola de operación: feed en vivo de agentes (simulado) + **agente de retención con IA real** decidiendo en vivo.

> ⚠️ Demo educativa. Toda la información es general y educativa; no sustituye consejo médico. Sin catálogo real, login ni pagos.

## Arquitectura de IA

Toda llamada a la IA pasa por **`app/api/ai/route.ts`** (proxy server-side a Gemini). La `GEMINI_API_KEY` vive **solo en el servidor** — nunca en el cliente. Los componentes hacen `fetch("/api/ai")` con `{ system, messages }` y reciben `{ text }`.

- Modelo: `gemini-3.5-flash` (constante en `route.ts`; verifica el nombre vigente en [AI Studio](https://aistudio.google.com) si cambia).
- Todas las llamadas tienen `try/catch` + **fallback** para que la demo nunca truene (chat con respuestas predefinidas, stack y retención con JSON de respaldo).

## Correr en local

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Crea `.env.local` en la raíz con tu key de [Google AI Studio](https://aistudio.google.com/apikey):

   ```
   GEMINI_API_KEY=tu_key_aqui
   ```

3. Levanta el dev server:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) (cliente) y [http://localhost:3000/consola](http://localhost:3000/consola) (operación).

Sin key, la app funciona igual con los fallbacks (útil para revisar el UI).

## Deploy a Vercel

1. Sube el repo a GitHub (o usa `vercel` CLI).
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa el repo. Vercel detecta Next.js automáticamente; no cambies build settings.
3. En **Settings → Environment Variables** agrega:
   - `GEMINI_API_KEY` = tu key de Google AI Studio (ambientes Production y Preview).
4. **Deploy**. Listo: la key queda solo en el servidor de Vercel.

## Estructura

```
app/
  page.tsx          # Flujo del cliente (client component)
  consola/page.tsx  # Consola de operación (client component)
  api/ai/route.ts   # Proxy a Gemini (solo servidor)
  layout.tsx        # Layout raíz, lang="es", fuente Archivo
lib/
  types.ts          # Message, Stack, StackItem, RetentionResult, TrainingSummary
```

## Principios de los agentes

- **Nutriólogo:** conversacional, una pregunta a la vez; detecta objetivo, entrenamiento y riesgos (alergias, condiciones médicas, embarazo, medicamentos). Nunca diagnostica; dosis en rangos generales seguros; deriva a profesional de salud cuando toca.
- **Retención:** autónomo, cálido, sin presión de venta — prioriza pausar/reducir si la señal sugiere lesión o pausa.
- **Strava:** simulado (resumen mock que alimenta al agente), marcado como demo en el UI.
