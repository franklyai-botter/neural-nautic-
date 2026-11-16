// Prueft die Server-Funktionen (src/worker) ohne Netz: esbuild buendelt den Worker (PDF/SVG wie bei wrangler
// als Daten bzw. Text), fetch nach Resend/Mistral wird durch eine Attrappe ersetzt, ASSETS ebenso.
// Aufruf: npm run test:worker. Exit 1 bei einem Fehlschlag.
import { build } from 'esbuild';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ordner = mkdtempSync(join(tmpdir(), 'nn-worker-test-'));
const datei = join(ordner, 'worker.mjs');
await build({
  entryPoints: [join(wurzel, 'src/worker/index.js')], bundle: true, format: 'esm', platform: 'neutral',
  outfile: datei, loader: { '.pdf': 'binary', '.svg': 'text' }, logLevel: 'error',
});
const worker = (await import(pathToFileURL(datei).href)).default;

// ---- Attrappen ----
let aufrufe = [];
let resendAntwort = { status: 200, body: { id: 'test' } };
let mistralAntworten = [];
globalThis.fetch = async (url, init) => {
  const u = String(url);
  aufrufe.push({ url: u, body: init?.body ? JSON.parse(init.body) : null, headers: init?.headers });
  if (u.startsWith('https://api.resend.com/')) return new Response(JSON.stringify(resendAntwort.body), { status: resendAntwort.status });
  if (u.startsWith('https://api.mistral.ai/')) {
    const a = mistralAntworten.shift() ?? { status: 200, body: { choices: [{ message: { content: 'Antwort' } }] } };
    return new Response(JSON.stringify(a.body), { status: a.status });
  }
  throw new Error('Unerwarteter Netzaufruf: ' + u);
};
// Wie Cloudflare mit html_handling drop-trailing-slash: /seite/ -> 307 auf /seite, /assets/fehlt -> 404 mit immutable
const ASSETS = { fetch: async (req) => {
  const u = new URL(req.url);
  if (u.pathname.length > 1 && u.pathname.endsWith('/')) return new Response(null, { status: 307, headers: { Location: u.pathname.slice(0, -1) + u.search } });
  if (u.pathname.startsWith('/assets/fehlt')) return new Response('nicht da', { status: 404, headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } });
  return new Response('<html>asset ' + u.pathname + '</html>', { headers: { 'Content-Type': 'text/html' } });
} };
const MIT = { ASSETS, RESEND_API_KEY: 're_test', MISTRAL_API_KEY: 'mi_test' };
const OHNE = { ASSETS };

const post = (pfad, body, { host = 'neuralnautic.de', origin = `https://${host}`, roh } = {}) =>
  new Request(`https://${host}${pfad}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) }, body: roh ?? JSON.stringify(body) });
const get = (pfad, host = 'neuralnautic.de') => new Request(`https://${host}${pfad}`);

let fehler = 0;
async function fall(name, fn) {
  aufrufe = []; resendAntwort = { status: 200, body: { id: 'test' } }; mistralAntworten = [];
  try { await fn(); console.log('ok   ' + name); } catch (e) { fehler++; console.log('FEHL ' + name + ': ' + e.message); }
}
const gleich = (ist, soll, was) => { if (ist !== soll) throw new Error(`${was}: ist ${JSON.stringify(ist)}, soll ${JSON.stringify(soll)}`); };
const wahr = (b, was) => { if (!b) throw new Error(was); };

const KONTAKT = { name: 'Erika Test', company: 'Testfirma', email: 'erika@example.org', phone: '', topic: 'KI-Potenzialanalyse', message: 'Hallo' };

// ---- Kontakt ----
await fall('Kontakt: Erfolg sendet eine Mail an Frank, Antwort {ok:true}', async () => {
  const r = await worker.fetch(post('/api/contact', KONTAKT), MIT);
  gleich(r.status, 200, 'Status'); gleich((await r.json()).ok, true, 'ok');
  gleich(aufrufe.length, 1, 'Mailaufrufe');
  const m = aufrufe[0].body;
  gleich(m.to[0], 'frankschuettai@neuralnautic.org', 'Empfänger'); gleich(m.reply_to, 'erika@example.org', 'reply_to');
  gleich(m.subject, 'Anfrage: KI-Potenzialanalyse — Testfirma', 'Betreff');
  wahr(m.text.includes('Telefon: –'), 'Telefon leer als –');
});
await fall('Kontakt: Pflichtfeld fehlt → 400, keine Mail', async () => {
  const r = await worker.fetch(post('/api/contact', { ...KONTAKT, company: '  ' }), MIT);
  gleich(r.status, 400, 'Status'); gleich((await r.json()).error, 'Pflichtfelder fehlen.', 'Text'); gleich(aufrufe.length, 0, 'Mails');
});
await fall('Kontakt: ohne Schlüssel → 503 „Mail-Dienst nicht konfiguriert.“', async () => {
  const r = await worker.fetch(post('/api/contact', KONTAKT), OHNE);
  gleich(r.status, 503, 'Status'); gleich((await r.json()).error, 'Mail-Dienst nicht konfiguriert.', 'Text');
});
await fall('Kontakt: Resend lehnt ab → 500', async () => {
  resendAntwort = { status: 422, body: { name: 'validation_error' } };
  const r = await worker.fetch(post('/api/contact', KONTAKT), MIT);
  gleich(r.status, 500, 'Status'); gleich((await r.json()).error, 'E-Mail konnte nicht gesendet werden.', 'Text');
});
await fall('Kontakt: kaputtes JSON → 400', async () => {
  const r = await worker.fetch(post('/api/contact', null, { roh: '{kaputt' }), MIT);
  gleich(r.status, 400, 'Status');
});
await fall('Kontakt: fremde Herkunft → 403, keine Mail', async () => {
  const r = await worker.fetch(post('/api/contact', KONTAKT, { origin: 'https://boese.example' }), MIT);
  gleich(r.status, 403, 'Status'); gleich(aufrufe.length, 0, 'Mails');
});
await fall('Kontakt: GET → 405', async () => {
  const r = await worker.fetch(get('/api/contact'), MIT); gleich(r.status, 405, 'Status');
});

// ---- Downloads ----
for (const [pfad, typ, start] of [['/api/checkliste-download', 'application/pdf', '%PDF'], ['/api/architektur-download', 'image/svg+xml; charset=utf-8', '<']]) {
  await fall(`${pfad}: ohne Angaben → Datei, keine Mail (auch ohne Schlüssel)`, async () => {
    const r = await worker.fetch(post(pfad, { name: '', email: '', phone: '', consent: false, website: '' }), OHNE);
    gleich(r.status, 200, 'Status'); gleich(r.headers.get('Content-Type'), typ, 'Typ');
    wahr(r.headers.get('Content-Disposition').startsWith('attachment; filename="NeuralNautic_'), 'Dateiname');
    const buf = Buffer.from(await r.arrayBuffer());
    wahr(buf.length > 10000, 'Datei zu klein: ' + buf.length);
    wahr(buf.toString('latin1').trimStart().startsWith(start), 'Dateianfang');
    gleich(aufrufe.length, 0, 'Mails');
  });
}
await fall('Download: mit Angaben und Einwilligung → Mail + Datei', async () => {
  const r = await worker.fetch(post('/api/checkliste-download', { name: 'Erika', email: 'erika@example.org', phone: '', consent: true, website: '' }), MIT);
  gleich(r.status, 200, 'Status'); gleich(aufrufe.length, 1, 'Mails');
  wahr(aufrufe[0].body.subject.startsWith('Download KI-Checkliste Reifegrad und Risiko (PDF): Erika'), 'Betreff');
  wahr(aufrufe[0].body.text.includes('Seite: /ki-im-unternehmen'), 'Seite im Text');
});
await fall('Download: Angaben ohne Einwilligung → 400', async () => {
  const r = await worker.fetch(post('/api/checkliste-download', { name: 'Erika', email: '', phone: '', consent: false, website: '' }), MIT);
  gleich(r.status, 400, 'Status'); wahr((await r.json()).error.startsWith('Wenn Sie Kontaktdaten angeben'), 'Text');
});
await fall('Download: Honeypot gefüllt → 400', async () => {
  const r = await worker.fetch(post('/api/checkliste-download', { name: '', email: '', phone: '', consent: false, website: 'x' }), MIT);
  gleich(r.status, 400, 'Status');
});
await fall('Download: falsche Telefonnummer → 400', async () => {
  const r = await worker.fetch(post('/api/architektur-download', { name: '', email: '', phone: '12ab', consent: true, website: '' }), MIT);
  gleich(r.status, 400, 'Status');
});
await fall('Download: Angaben ohne Schlüssel → 503 (keine stille Datei)', async () => {
  const r = await worker.fetch(post('/api/architektur-download', { name: 'Erika', email: '', phone: '', consent: true, website: '' }), OHNE);
  gleich(r.status, 503, 'Status');
});
await fall('Download: Angaben ohne Schlüssel, LEAD_MAIL_OPTIONAL=1 → Datei', async () => {
  const r = await worker.fetch(post('/api/architektur-download', { name: 'Erika', email: '', phone: '', consent: true, website: '' }), { ...OHNE, LEAD_MAIL_OPTIONAL: '1' });
  gleich(r.status, 200, 'Status');
});

// ---- Chat ----
await fall('Chat: Antwort {message, model}', async () => {
  const r = await worker.fetch(post('/api/chat', { messages: [{ role: 'user', content: 'Was ist RAG?' }] }), MIT);
  gleich(r.status, 200, 'Status');
  const j = await r.json(); gleich(j.message, 'Antwort', 'message'); gleich(j.model, 'ministral-14b-2512', 'model');
  const m = aufrufe[0].body.messages; gleich(m[0].role, 'system', 'erste Rolle'); gleich(m.at(-1).role, 'user', 'letzte Rolle');
  gleich(aufrufe[0].body.max_tokens, 1500, 'max_tokens');
});
await fall('Chat: assistant am Ende wird entfernt', async () => {
  const r = await worker.fetch(post('/api/chat', { messages: [{ role: 'user', content: 'a' }, { role: 'assistant', content: 'b' }] }), MIT);
  gleich(r.status, 200, 'Status'); gleich(aufrufe[0].body.messages.length, 2, 'system + user');
});
await fall('Chat: 403/429 → nächstes Modell, dann Erfolg', async () => {
  mistralAntworten = [{ status: 403, body: {} }, { status: 429, body: {} }];
  const r = await worker.fetch(post('/api/chat', { messages: [{ role: 'user', content: 'a' }] }), MIT);
  gleich((await r.json()).model, 'mistral-small-latest', 'Modell'); gleich(aufrufe.length, 3, 'Versuche');
});
await fall('Chat: 500 von Mistral → 502 ohne weitere Versuche', async () => {
  mistralAntworten = [{ status: 500, body: {} }];
  const r = await worker.fetch(post('/api/chat', { messages: [{ role: 'user', content: 'a' }] }), MIT);
  gleich(r.status, 502, 'Status'); gleich(aufrufe.length, 1, 'Versuche');
});
await fall('Chat: Verlauf auf 20 und 2000 Zeichen gekürzt', async () => {
  const messages = Array.from({ length: 25 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: 'x'.repeat(3000) }));
  messages.push({ role: 'user', content: 'ende' });
  await worker.fetch(post('/api/chat', { messages }), MIT);
  const m = aufrufe[0].body.messages; gleich(m.length, 21, 'system + 20'); gleich(m[1].content.length, 2000, 'Länge');
});
await fall('Chat: ohne Schlüssel → 503', async () => {
  const r = await worker.fetch(post('/api/chat', { messages: [{ role: 'user', content: 'a' }] }), OHNE);
  gleich(r.status, 503, 'Status'); gleich((await r.json()).error, 'Chatbot nicht konfiguriert.', 'Text');
});
await fall('Chat: keine Nachrichten → 400', async () => {
  const r = await worker.fetch(post('/api/chat', { messages: [] }), MIT); gleich(r.status, 400, 'Status');
});

// ---- Routing und Header ----
await fall('Produktiv: kein noindex, Sicherheits-Header gesetzt', async () => {
  const r = await worker.fetch(get('/leistungen'), OHNE);
  gleich(r.headers.get('X-Robots-Tag'), null, 'X-Robots-Tag');
  wahr(r.headers.get('Content-Security-Policy').includes("script-src 'self' 'sha256-"), 'CSP');
  wahr(r.headers.get('Strict-Transport-Security').startsWith('max-age='), 'HSTS');
});
await fall('Vorschau (workers.dev): noindex und sperrende robots.txt', async () => {
  const host = 'funnel-neuralnautic.frankschuettai.workers.dev';
  const r = await worker.fetch(get('/', host), OHNE);
  gleich(r.headers.get('X-Robots-Tag'), 'noindex, nofollow', 'X-Robots-Tag');
  const rb = await worker.fetch(get('/robots.txt', host), OHNE);
  gleich(await rb.text(), 'User-agent: *\nDisallow: /\n', 'robots.txt');
});
await fall('Produktiv: robots.txt kommt aus dist/', async () => {
  const r = await worker.fetch(get('/robots.txt'), OHNE);
  wahr((await r.text()).includes('asset /robots.txt'), 'aus ASSETS');
});
await fall('www → Hauptadresse 301', async () => {
  const r = await worker.fetch(get('/methode?x=1', 'www.neuralnautic.de'), OHNE);
  gleich(r.status, 301, 'Status'); gleich(r.headers.get('Location'), 'https://neuralnautic.de/methode?x=1', 'Ziel');
});
await fall('Schrägstrich am Ende: 307 wird 308 (dauerhaft), Abfrage bleibt', async () => {
  const r = await worker.fetch(get('/leistungen/?a=b'), OHNE);
  gleich(r.status, 308, 'Status'); gleich(r.headers.get('Location'), '/leistungen?a=b', 'Ziel');
  wahr(r.headers.get('Content-Security-Policy'), 'Header auch an der Umleitung');
});
await fall('Fehlende Datei unter /assets/ wird nicht zwischengespeichert', async () => {
  const r = await worker.fetch(get('/assets/fehlt.js'), OHNE);
  gleich(r.status, 404, 'Status'); gleich(r.headers.get('Cache-Control'), 'no-store', 'Cache-Control');
});
await fall('Unbekannte API → 404', async () => {
  const r = await worker.fetch(post('/api/gibtsnicht', {}), OHNE); gleich(r.status, 404, 'Status');
});

console.log(fehler ? `\n${fehler} Fehlschläge` : '\nAlle Prüfungen bestanden.');
process.exit(fehler ? 1 : 0);
