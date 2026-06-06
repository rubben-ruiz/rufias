import { NextRequest } from "next/server";

// Único punto de contacto con la IA. La key vive SOLO en el servidor.
// Verifica en https://aistudio.google.com el nombre vigente si este modelo cambia.
const GEMINI_MODEL = "gemini-3.5-flash";

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const { system, messages } = (await req.json()) as {
      system?: string;
      messages: Msg[];
    };

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { text: "", error: "Falta GEMINI_API_KEY en el servidor." },
        { status: 500 }
      );
    }

    const contents = (messages || []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: system ? { parts: [{ text: system }] } : undefined,
          contents,
          generationConfig: { maxOutputTokens: 1024 },
        }),
      }
    );

    const data = await r.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("") ?? "";

    return Response.json({ text });
  } catch {
    // La demo nunca truena: el cliente tiene fallbacks para texto vacío.
    return Response.json({ text: "", error: "Error llamando a la IA." }, { status: 500 });
  }
}
