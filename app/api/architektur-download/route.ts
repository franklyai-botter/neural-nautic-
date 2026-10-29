import { Resend } from "resend";
import { NextResponse } from "next/server";
import svg from "./grafik.generated";

// Download der Architektur-Grafik nur gegen Name, E-Mail und Telefon.
// Die Angaben gehen per Mail an Frank (wie beim Kontaktformular), gespeichert wird hier nichts.
// LEAD_MAIL_OPTIONAL=1 nur für die lokale Vorschau ohne Resend-Schlüssel: dann wird der Lead
// ins Server-Log geschrieben statt gemailt. Auf der Live-Seite nicht setzen.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9 ()/.-]{6,25}$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const consent = body.consent === true;

  // Honeypot: Feld ist für Menschen unsichtbar, Bots füllen es aus.
  if (String(body.website ?? "") !== "") {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Bitte geben Sie Ihren Namen an." }, { status: 400 });
  }
  if (!EMAIL.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Bitte geben Sie eine gültige E-Mail-Adresse an." }, { status: 400 });
  }
  if (!PHONE.test(phone) || phone.replace(/\D/g, "").length < 6) {
    return NextResponse.json({ error: "Bitte geben Sie eine gültige Telefonnummer an." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ error: "Bitte bestätigen Sie die Einwilligung." }, { status: 400 });
  }

  const zeit = new Date().toISOString();
  const text = `Download: KI-Architektur in sieben Schichten (Grafik)
Name: ${name}
E-Mail: ${email}
Telefon: ${phone}
Einwilligung erteilt: ja, ${zeit}
Seite: /ki-im-betrieb`;

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "NeuralNautic Website <onboarding@resend.dev>",
      to: "frankschuettai@neuralnautic.org",
      replyTo: email,
      subject: `Download KI-Architektur: ${name}`,
      text,
    });
    if (error) {
      return NextResponse.json({ error: "Die Anfrage konnte nicht verarbeitet werden. Bitte versuchen Sie es später erneut." }, { status: 500 });
    }
  } else if (process.env.LEAD_MAIL_OPTIONAL === "1") {
    console.log("[architektur-download] Lead (Vorschau, keine Mail):\n" + text);
  } else {
    return NextResponse.json({ error: "Mail-Dienst nicht konfiguriert." }, { status: 503 });
  }

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": 'attachment; filename="NeuralNautic_KI-Architektur_7-Schichten.svg"',
      "Cache-Control": "no-store",
    },
  });
}
