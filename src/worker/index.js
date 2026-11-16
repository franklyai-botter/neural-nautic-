// Worker der NeuralNautic-Seite (Cloudflare Workers mit Static Assets).
//
// Jede Anfrage laeuft zuerst hier durch (assets.run_worker_first), damit an einer Stelle gilt:
// - /api/* sind die Server-Funktionen der Live-Seite (Kontakt, zwei Downloads, Chat), siehe api.js.
// - Alles andere kommt aus dist/ (env.ASSETS; _redirects und html_handling greifen dort).
// - Sicherheits-Header fuer jede Antwort (Pruefpunkt A6: CSP, HSTS).
// - Nur auf neuralnautic.de ist die Seite fuer Suchmaschinen offen. Jede andere Adresse (Vorschau auf
//   workers.dev, lokale Tests) bekommt noindex und eine sperrende robots.txt. So kann dieselbe Fassung
//   erst als Vorschau und spaeter unveraendert als Hauptseite laufen.
import { bearbeiteApi } from './api.js';

const PRODUKTIV = new Set(['neuralnautic.de', 'www.neuralnautic.de']);

// Einziges erlaubtes Inline-Skript, Zeichen fuer Zeichen (setzt die Klasse js, damit die statische
// Fassung fuer Leser ohne JavaScript ausgeblendet wird):
//   <script>document.documentElement.classList.add('js')</script>
// Aendert sich die Zeile, muss der Hash neu berechnet werden:
//   printf "%s" "document.documentElement.classList.add('js')" | openssl dgst -sha256 -binary | openssl base64
const SKRIPT_JS_KLASSE = "'sha256-Du+OJKJSbdUgz5nrHeWWINvez6XKDDU/tyj/5c2uvwo='";

const CSP = [
  "default-src 'self'",
  `script-src 'self' ${SKRIPT_JS_KLASSE}`,
  // Stil-Attribute im erzeugten HTML (Masken, Seitenverhaeltnisse) brauchen unsafe-inline
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const SICHERHEIT = {
  'Content-Security-Policy': CSP,
  // Ohne includeSubDomains: andere Dienste unter *.neuralnautic.de sollen nicht mitgebunden werden
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

const ROBOTS_GESPERRT = 'User-agent: *\nDisallow: /\n';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const produktiv = PRODUKTIV.has(url.hostname);
    let antwort;
    if (url.hostname === 'www.neuralnautic.de') {
      // Live leitet www schon per Regel in der Cloudflare-Zone um; das hier greift, falls die Regel wegfaellt
      url.hostname = 'neuralnautic.de';
      antwort = Response.redirect(url.toString(), 301);
    } else if (url.pathname.startsWith('/api/')) {
      antwort = await bearbeiteApi(request, env, url);
    } else if (url.pathname === '/robots.txt' && !produktiv) {
      antwort = new Response(ROBOTS_GESPERRT, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    } else {
      antwort = await env.ASSETS.fetch(request);
    }
    return mitHeadern(antwort, produktiv, url);
  },
};

function mitHeadern(antwort, produktiv, url) {
  let r = new Response(antwort.body, antwort);
  // html_handling leitet /leistungen/ mit 307 (voruebergehend) auf /leistungen. Fuer Suchmaschinen dauerhaft
  // machen, wie live (308): sonst gelten beide Adressen als eigenstaendig.
  if (r.status === 307 && url.pathname.endsWith('/') && r.headers.get('Location') === url.pathname.slice(0, -1) + url.search) {
    r = new Response(null, { status: 308, headers: r.headers });
  }
  // Fehlende Dateien unter /assets/ nicht ein Jahr lang zwischenspeichern (_headers setzt immutable fuer alles dort)
  if (!r.ok && url.pathname.startsWith('/assets/')) r.headers.set('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(SICHERHEIT)) r.headers.set(k, v);
  if (!produktiv) r.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return r;
}
