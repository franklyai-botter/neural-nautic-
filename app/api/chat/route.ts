import { NextResponse } from "next/server";

const SYSTEM = `Du bist der KI-Assistent von NeuralNautic – dem KI-Beratungsunternehmen von Frank Schütt für den DACH-Mittelstand.

Deine Kernthemen:
- DSGVO-Compliance beim KI-Einsatz (Art. 5, 6, 13, 22, 25, 32 DSGVO)
- EU AI Act: Risikoklassen, Pflichten, Fristen, Umsetzung
- Datenschutz und Datensicherheit bei KI-Projekten
- Abmahnrisiken und wie man sie vermeidet
- Praktische KI-Implementierung im Mittelstand (ohne Datenabfluss)

Regeln:
- Antworte immer auf Deutsch
- Kurz und direkt – du sprichst mit Geschäftsführern, nicht mit Juristen
- Keine leeren Floskeln oder Buzzwords
- Wenn jemand konkrete Beratung braucht: weise freundlich auf den KI-Check mit Frank hin (/kontakt)
- Du speicherst keine Gesprächsdaten, kein Tracking`;

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as { messages: Message[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Keine Nachrichten." }, { status: 400 });
    }

    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [{ role: "system", content: SYSTEM }, ...messages],
        max_tokens: 800,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: `Mistral Fehler: ${data?.message ?? res.status}` }, { status: 502 });
    }
    const text = data.choices?.[0]?.message?.content ?? "Keine Antwort erhalten.";
    return NextResponse.json({ message: text });
  } catch (err) {
    return NextResponse.json({ error: `Serverfehler: ${String(err)}` }, { status: 500 });
  }
}
