// Server-Funktionen der NeuralNautic-Seite, uebernommen von der Live-Seite (neural-nautic-live @ 447000b:
// app/api/contact, app/api/chat, app/api/architektur-download, app/api/checkliste-download, app/lib/lead.ts).
// Regeln, Texte, Empfaenger und Systemanweisung kommen unveraendert aus src/inhalt/backend.js, damit es
// nur eine Quelle gibt. Unterschiede zu live:
// - Resend ueber die HTTP-Schnittstelle statt ueber das npm-Paket (gleiche Felder).
// - Anfragen von fremden Seiten (Origin-Header mit anderem Host) werden abgewiesen, damit niemand ueber
//   ein eigenes Formular Mails an Frank ausloest.
// - Kaputtes JSON gibt 400 „Ungültige Anfrage.“ statt eines 500.
// - Die Dateien liegen nicht in public/, sondern werden nur ueber diese Routen ausgeliefert (A8).
// Geheimnisse (Cloudflare Secrets): RESEND_API_KEY, MISTRAL_API_KEY. LEAD_MAIL_OPTIONAL=1 nur lokal.
import { MAIL, KONTAKT_API, LEAD, DOWNLOAD_API, CHAT_SYSTEM, CHAT_API } from '../inhalt/backend.js';
import architekturSvg from './dateien/NeuralNautic_KI-Architektur_7-Schichten.svg';
import checklistePdf from './dateien/NeuralNautic_KI-Checkliste_Reifegrad-und-Risiko.pdf';

const DATEIEN = {
  '/api/architektur-download': architekturSvg,
  '/api/checkliste-download': checklistePdf,
};

const UNGUELTIG = { status: 400, error: 'Ungültige Anfrage.' };

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});
const fehler = (f) => json({ error: f.error }, f.status);
const text = (v) => (typeof v === 'string' ? v.trim() : '');

export async function bearbeiteApi(request, env, url) {
  if (request.method !== 'POST') {
    return new Response('Nur POST.', { status: 405, headers: { Allow: 'POST', 'Cache-Control': 'no-store' } });
  }
  if (!gleicheHerkunft(request, url)) return json({ error: UNGUELTIG.error }, 403);

  if (url.pathname === KONTAKT_API.pfad) return kontakt(request, env);
  if (url.pathname === CHAT_API.pfad) return chat(request, env);
  const download = DOWNLOAD_API.find((d) => d.pfad === url.pathname);
  if (download) return datei(request, env, download);
  return json({ error: 'Nicht gefunden.' }, 404);
}

// Browser senden bei POST immer Origin. Fehlt er (andere Clients), wie live durchlassen.
function gleicheHerkunft(request, url) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  try { return new URL(origin).host === url.host; } catch { return false; }
}

async function lesen(request) {
  try {
    const d = await request.json();
    return d && typeof d === 'object' && !Array.isArray(d) ? d : null;
  } catch { return null; }
}

async function mailSenden(env, { replyTo, subject, text: inhalt }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: MAIL.from, to: [MAIL.to], ...(replyTo ? { reply_to: replyTo } : {}), subject, text: inhalt }),
  });
  if (!res.ok) {
    // Nur Status und Fehlerart ins Log, keine Angaben aus dem Formular
    const art = await res.json().then((j) => j?.name).catch(() => '');
    console.error('Resend-Fehler', res.status, art);
  }
  return res.ok;
}

/* ---------- POST /api/contact ---------- */
async function kontakt(request, env) {
  const A = KONTAKT_API.antworten;
  const d = await lesen(request);
  if (!d) return fehler(UNGUELTIG);
  const f = Object.fromEntries(KONTAKT_API.felder.map((n) => [n, text(d[n])]));
  if (KONTAKT_API.pflicht.some((n) => !f[n])) return fehler(A.pflichtFehlt);
  if (!env.RESEND_API_KEY) return fehler(A.nichtKonfiguriert);
  const ok = await mailSenden(env, { replyTo: f.email, subject: KONTAKT_API.betreff(f), text: KONTAKT_API.text(f) });
  if (!ok) return fehler(A.versandFehler);
  return json(A.ok.body);
}

/* ---------- Downloads gegen freiwillige Kontaktdaten (lead.ts) ---------- */
// Liefert eine Fehlerantwort oder null, wenn der Download starten darf.
async function leadMelden(request, env, unterlage, seite) {
  const F = LEAD.fehler;
  const d = await lesen(request);
  if (!d) return fehler(F.ungueltig);
  const name = text(d.name);
  const email = text(d.email);
  const phone = text(d.phone);
  const consent = d.consent === true;
  if (String(d.website ?? '') !== '') return fehler(F.ungueltig);   // Honeypot
  if (!name && !email && !phone) return null;                         // ohne Angaben: Download ohne Meldung
  if (name.length > 120) return fehler(F.nameZuLang);
  if (email && (!LEAD.email.test(email) || email.length > 200)) return fehler(F.email);
  if (phone && (!LEAD.phone.test(phone) || phone.replace(/\D/g, '').length < 6)) return fehler(F.telefon);
  if (!consent) return fehler(F.einwilligung);

  const inhalt = LEAD.text({ unterlage, name, email, phone, seite });
  if (env.RESEND_API_KEY) {
    const ok = await mailSenden(env, { replyTo: email || undefined, subject: LEAD.betreff({ unterlage, name, email, phone }), text: inhalt });
    if (!ok) return fehler(F.versand);
  } else if (env.LEAD_MAIL_OPTIONAL === '1') {
    console.log(`[download] Lead (Vorschau, keine Mail):\n${inhalt}`);
  } else {
    return fehler(F.nichtKonfiguriert);
  }
  return null;
}

async function datei(request, env, D) {
  const f = await leadMelden(request, env, D.unterlage, D.seite);
  if (f) return f;
  return new Response(DATEIEN[D.pfad], {
    headers: {
      'Content-Type': D.contentType,
      'Content-Disposition': `attachment; filename="${D.dateiname}"`,
      'Cache-Control': 'no-store',
    },
  });
}

/* ---------- POST /api/chat (Mistral AI) ---------- */
async function chat(request, env) {
  const C = CHAT_API;
  if (!env.MISTRAL_API_KEY) return fehler(C.fehler.nichtKonfiguriert);
  try {
    const body = await lesen(request);
    const roh = Array.isArray(body?.messages) ? body.messages : [];
    if (roh.length === 0) return fehler(C.fehler.keineNachrichten);

    let nachrichten = roh
      .filter((m) => m && typeof m === 'object' && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-C.maxVerlauf)
      .map((m) => ({ role: m.role, content: m.content.slice(0, C.maxNachrichtLaenge) }));
    // Mistral erfordert, dass die letzte Nachricht von „user“ kommt
    while (nachrichten.length > 0 && nachrichten[nachrichten.length - 1].role !== 'user') nachrichten = nachrichten.slice(0, -1);
    if (nachrichten.length === 0) return fehler(C.fehler.ungueltig);

    // Free-Plan: nicht jedes Modell ist freigegeben (403), Limits knapp (429) -> naechstes versuchen
    let letzterStatus = 0;
    for (const model of C.modelle) {
      const res = await fetch(C.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.MISTRAL_API_KEY}` },
        body: JSON.stringify({ model, messages: [{ role: 'system', content: CHAT_SYSTEM }, ...nachrichten], max_tokens: C.maxTokens }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const antwort = data.choices?.[0]?.message?.content ?? C.antwortFehlt;
        return json({ message: antwort, model });
      }
      letzterStatus = res.status;
      console.error('Mistral-Fehler', model, res.status, JSON.stringify(data).slice(0, 300));
      if (res.status !== 403 && res.status !== 429) break;
    }
    return json({ error: C.fehler.dienst.error, upstream: letzterStatus }, C.fehler.dienst.status);
  } catch {
    return fehler(C.fehler.allgemein);
  }
}
