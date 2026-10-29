import { Resend } from "resend";
import { NextResponse } from "next/server";

// Gemeinsame Logik für Downloads mit freiwilligen Kontaktdaten (Name, E-Mail, Telefon, Einwilligung).
// Die Angaben gehen per Mail an Frank (wie beim Kontaktformular), gespeichert wird hier nichts.
// LEAD_MAIL_OPTIONAL=1 nur für die lokale Vorschau ohne Resend-Schlüssel: dann wird der Lead
// ins Server-Log geschrieben statt gemailt. Auf der Live-Seite nicht setzen.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9 ()/.-]{6,25}$/;

/** Prüft die Angaben und meldet den Lead. Liefert eine Fehlerantwort oder null, wenn alles passt. */
export async function leadMelden(req: Request, unterlage: string, seite: string): Promise<NextResponse | null> {
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
  // Alle Angaben sind freiwillig (wie bei Roman, Frank 29.10.2026). Ohne Angaben: Download ohne Meldung.
  if (!name && !email && !phone) return null;
  if (name.length > 120) {
    return NextResponse.json({ error: "Der Name ist zu lang." }, { status: 400 });
  }
  if (email && (!EMAIL.test(email) || email.length > 200)) {
    return NextResponse.json({ error: "Bitte prüfen Sie die E-Mail-Adresse oder lassen Sie das Feld leer." }, { status: 400 });
  }
  if (phone && (!PHONE.test(phone) || phone.replace(/\D/g, "").length < 6)) {
    return NextResponse.json({ error: "Bitte prüfen Sie die Telefonnummer oder lassen Sie das Feld leer." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ error: "Wenn Sie Kontaktdaten angeben, bestätigen Sie bitte die Einwilligung. Ohne Angaben geht der Download auch so." }, { status: 400 });
  }

  const text = `Download: ${unterlage}
Name: ${name || "keine Angabe"}
E-Mail: ${email || "keine Angabe"}
Telefon: ${phone || "keine Angabe"}
Einwilligung erteilt: ja, ${new Date().toISOString()}
Seite: ${seite}`;

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "NeuralNautic Website <onboarding@resend.dev>",
      to: "frankschuettai@neuralnautic.org",
      replyTo: email || undefined,
      subject: `Download ${unterlage}: ${name || email || phone}`,
      text,
    });
    if (error) {
      return NextResponse.json({ error: "Die Anfrage konnte nicht verarbeitet werden. Bitte versuchen Sie es später erneut." }, { status: 500 });
    }
  } else if (process.env.LEAD_MAIL_OPTIONAL === "1") {
    console.log(`[download] Lead (Vorschau, keine Mail):\n${text}`);
  } else {
    return NextResponse.json({ error: "Mail-Dienst nicht konfiguriert." }, { status: 503 });
  }
  return null;
}
