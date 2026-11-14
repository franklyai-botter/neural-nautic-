// Inhalt der Startseite. Texte, Zahlen und Quellen wörtlich aus neural-nautic-live (447000b):
// app/page.tsx, app/site.ts, app/components/Footer.tsx, KiLogoWirbel.tsx, PartnerBand.tsx,
// app/leistungen/page.tsx (Kurztext, Ergebnis), app/ki-im-unternehmen/page.tsx und
// ArchitekturDownload.tsx (die zwei Downloads). Hier wird nichts formuliert, nur zugeordnet.
// Bildzuordnungen (welches Bild an welchem Platz) sind Gestaltung, kein Inhalt der Live-Seite.

import figuren from '../../figuren.json';
import { REIFEGRAD, reifegradAuswerten } from './ki-im-unternehmen.js';

export const SITE = {
  name: 'NeuralNautic',
  kiCheck: 'https://calendly.com/frankschuettai-neuralnautic/ki-potenzialcheck',
  linkedinFrank: 'https://www.linkedin.com/in/frank-schuett/',
  linkedinNN: 'https://www.linkedin.com/company/neuralnautic/',
  x: 'https://x.com/FSchuettNN',
  for42: 'https://for42.ai',
};

export const BERUHIGUNG = '30 Minuten per Video, kostenlos und unverbindlich. Danach wissen Sie, wo KI bei Ihnen zuerst wirkt.';
export const KI = 'KI-generiert';

/* ---------- Bilder: Namen, Maße und Kopf-Anker kommen aus figuren.json (schreibt tools/bilder.py) ----------
   Hier steht nur die Rolle (Foto oder Exo, Ansicht). Tauscht der Hero-Agent Bilder, zieht die Seite mit. */
const FIG = figuren.saetze[figuren.satz].figuren[0];
const ansicht = (k) => FIG.ansichten[k] || FIG.ansichten.frontal || Object.values(FIG.ansichten)[0];
const ROLLEN = {
  fotoFrontal: [ansicht('frontal'), 'foto'], fotoLinks: [ansicht('links'), 'foto'], fotoRechts: [ansicht('rechts'), 'foto'],
  exoFrontal: [ansicht('frontal'), 'exo'], exoLinks: [ansicht('links'), 'exo'], exoRechts: [ansicht('rechts'), 'exo'],
  ganzFoto: [FIG.ganzkoerper, 'foto'], ganzExo: [FIG.ganzkoerper, 'exo'],
};
const klemme = (v) => Math.min(100, Math.max(0, Math.round(v)));
/**
 * Bild einer Rolle. breite = gewünschte Breite in px, verh = Breite/Höhe der Bildfläche,
 * kopf = [x, y] Stelle in der Fläche (0…1), an der die Kopfmitte sitzen soll.
 */
export function bild(rolle, breite = 640, { verh, kopf = [0.5, 0.4] } = {}) {
  const [paar, art] = ROLLEN[rolle];
  const name = paar[art];
  const m = figuren.bilder[name];
  const b = [...m.breiten].sort((x, y) => x - y);
  const w = b.find((x) => x >= breite) ?? b[b.length - 1];
  const A = m.b / m.h;
  const a = paar.anker;
  let position;
  if (verh) {
    position = A > verh
      ? `${klemme(100 * (a.x * A - kopf[0] * verh) / (A - verh))}% 50%`
      : `50% ${klemme(100 * (a.y / A - kopf[1] / verh) / (1 / A - 1 / verh || 1))}%`;
  }
  // maske = Alpha-Maske der Figur (schreibt tools/bilder.py), mitte = Koerper- bzw. Kopfmitte als Anteil der Bildbreite
  return { src: `/bilder/${name}-${w}.webp`, w, h: Math.round(w / A), position, maske: `/bilder/${name}-hof.webp`, mitte: a.mx ?? a.x };
}
const menueBild = (rolle, kopf) => { const x = bild(rolle, 640, { verh: 4 / 3, kopf }); return { bild: x.src, position: x.position }; };
const faecherBild = (rolle, kopf) => { const x = bild(rolle, 640, { verh: 3 / 4.1, kopf }); return { bild: x.src, position: x.position }; };

/* ---------- Seitenrahmen ---------- */
export const KOPF = {
  logo: { src: '/brand/nn-stern-kompass-128.png', alt: '', name: 'NeuralNautic', href: '/' },
  cta: { text: 'KI-Check buchen', href: SITE.kiCheck, extern: true },
  menue: { auf: 'Menü öffnen', zu: 'Menü schließen' },
};

// Einträge und Adressen wie im Brief (Live-Adressen). Bilder: nur Franks Bilder, Rollen aus figuren.json.
export const MENUE = {
  titel: 'Menü',
  eintraege: [
    { text: 'Start', href: '/', ...menueBild('fotoFrontal') },
    { text: 'Leistungen', href: '/leistungen', ...menueBild('ganzExo', [0.5, 0.3]) },
    { text: 'Im Unternehmen', href: '/ki-im-unternehmen', ...menueBild('fotoLinks') },
    { text: 'Im Projekt', href: '/methode', ...menueBild('exoRechts') },
    { text: 'AI Engineering', href: '/ai-engineering', ...menueBild('ganzExo', [0.5, -0.9]) },
    { text: 'KI Tool Kompass', href: '/ki-tool-kompass', ...menueBild('exoLinks') },
    { text: 'Ausguck', href: '/wissen', ...menueBild('fotoRechts') },
    { text: 'Über mich', href: '/ueber-mich', ...menueBild('ganzFoto', [0.5, 0.3]) },
    { text: 'Kontakt', href: '/kontakt', bild: '/inhalt/frank-ki/film.webp', position: '50% 40%' },
  ],
  bildHinweis: KI,
  nebenLinks: [
    { text: 'LinkedIn Frank', href: SITE.linkedinFrank, extern: true },
    { text: 'LinkedIn NeuralNautic', href: SITE.linkedinNN, extern: true },
    { text: 'X @FSchuettNN', href: SITE.x, extern: true },
  ],
  cta: { text: 'KI-Potenzialcheck buchen', href: SITE.kiCheck, extern: true },
};

export const FUSS = {
  logo: { src: '/brand/nn-monogramm.png', alt: 'NeuralNautic', w: 805, h: 821 },
  claim: 'Pragmatische KI-Beratung. Für den Mittelstand gebaut. Für regulierte Branchen gehärtet.',
  ort: 'Berlin · Bundesweit · DACH',
  cta: { text: 'Anfrage senden', href: '/kontakt' },
  // „Seiten“ = alle Seiten des Menüs (Brief: Footer mit allen Seiten); die drei weiteren Spalten wie Footer.tsx
  spalten: [
    { titel: 'Seiten', links: [
      ['Start', '/'], ['Leistungen', '/leistungen'], ['Im Unternehmen', '/ki-im-unternehmen'], ['Im Projekt', '/methode'],
      ['AI Engineering', '/ai-engineering'], ['KI Tool Kompass', '/ki-tool-kompass'], ['Ausguck', '/wissen'],
      ['Über mich', '/ueber-mich'], ['Kontakt', '/kontakt'],
    ] },
    { titel: 'Leistungen', links: [
      ['KI-Potenzialanalyse', '/leistungen'], ['KI-Architektur', '/leistungen'], ['Controlled Pilot', '/leistungen'],
      ['KI-Automatisierung', '/leistungen'], ['Agentic Engineering', '/ai-engineering'], ['KI-Governance', '/leistungen'],
      ['KI-Schulung', '/leistungen'],
    ] },
    { titel: 'Angebote', links: [
      ['KI im Unternehmen', '/ki-im-unternehmen'], ['KI im Projekt', '/methode'], ['AI Engineering', '/ai-engineering'],
      ['KI Tool Kompass', '/ki-tool-kompass'], ['Ausguck', '/wissen'],
    ] },
    { titel: 'Kontakt', links: [
      ['Über mich', '/ueber-mich'], ['Anfrage senden', '/kontakt'], ['LinkedIn Frank ↗', SITE.linkedinFrank],
      ['LinkedIn NeuralNautic ↗', SITE.linkedinNN], ['X @FSchuettNN ↗', SITE.x], ['FOR42.ai ↗', SITE.for42],
    ] },
  ],
  copyright: `© ${new Date().getFullYear()} · NeuralNautic · in Gründung · Frank Schütt`,
  recht: [['Impressum', '/impressum'], ['Datenschutz', '/datenschutz']],
};

/* ---------- L2: Widget unten links im Hero (Lando: Next-Race-Karte) ---------- */
// Titel des Abschnitts „Reifegrad-Check“ auf /ki-im-unternehmen, wörtlich
export const WIDGET = {
  lasche: 'Reifegrad-Check',
  zahl: '6', einheit: 'Fragen',
  text: 'Wo Sie heute stehen, zeigen sechs Fragen in fünf Minuten',
  href: '#reifegrad',   // springt auf den Store-Platz dieser Seite (L10)
};

/* ---------- L3: der alte Header (Logo-Wirbel, H1, Zahl, ein Knopf, Beleg) ---------- */
// Reihenfolge und Namen wie KiLogoWirbel.tsx. Die drei eigenen Kacheln (NN-Monogramm, NN-Stern, for42)
// kommen aus public/brand, die Anbieter-Logos unverändert aus public/medien/ki-logos (LIZENZ.txt liegt dort).
const ANBIETER = [
  ['openai.svg', 'OpenAI'], ['claude-color.svg', 'Anthropic Claude'], ['gemini-color.svg', 'Google Gemini'],
  ['deepseek-color.svg', 'DeepSeek'], ['meta-color.svg', 'Meta'], ['mistral-color.svg', 'Mistral AI'],
  ['xai.svg', 'xAI'], ['spacexai.svg', 'SpaceXAI'], ['qwen-color.svg', 'Alibaba Qwen'], ['alibaba-color.svg', 'Alibaba'],
  ['kimi-color.svg', 'Moonshot Kimi'], ['zhipu-color.svg', 'Z AI'], ['minimax-color.svg', 'MiniMax'],
  ['cohere-color.svg', 'Cohere'], ['nvidia-color.svg', 'NVIDIA'], ['aws-color.svg', 'Amazon Web Services'],
  ['microsoft-color.svg', 'Microsoft'], ['ibm.svg', 'IBM'], ['perplexity-color.svg', 'Perplexity'],
  ['bytedance-color.svg', 'ByteDance Seed'], ['baidu-color.svg', 'Baidu'], ['tencent-color.svg', 'Tencent'],
  ['stepfun-color.svg', 'StepFun'], ['anthropic.svg', 'Anthropic'], ['google-color.svg', 'Google'],
  ['xiaomi.svg', 'Xiaomi'], ['inclusionai.jpg', 'InclusionAI'], ['longcat-color.svg', 'LongCat'],
  ['ai21.svg', 'AI21 Labs'], ['upstage-color.svg', 'Upstage'], ['liquid.svg', 'Liquid AI'],
  ['ai2-color.svg', 'Allen Institute for AI'], ['lg-color.svg', 'LG AI Research'], ['tii-color.svg', 'TII'],
  ['nousresearch.svg', 'Nous Research'], ['reka.svg', 'Reka AI'], ['inception.svg', 'Inception'],
  ['arcee-color.svg', 'Arcee AI'], ['ifm.svg', 'Institute of Foundation Models'], ['reflection.svg', 'Reflection AI'],
  ['thinking-machines.svg', 'Thinking Machines'], ['china-mobile.png', 'China Mobile'], ['prime-intellect.svg', 'Prime Intellect'],
  ['sarvam.svg', 'Sarvam'], ['servicenow.svg', 'ServiceNow'], ['sktelecom.svg', 'SK Telecom'],
  ['korea-telecom.png', 'Korea Telecom'], ['naver.webp', 'Naver'], ['trillionlabs.svg', 'Trillion Labs'],
  ['motif.svg', 'Motif Technologies'], ['multiversecomputing.svg', 'Multiverse Computing'], ['nex.svg', 'Nex AGI'],
  ['openbmb.svg', 'OpenBMB'], ['ai9stars.svg', 'AI9Stars'], ['apodex.svg', 'Apodex'], ['celeris.svg', 'Celeris'],
  ['kwaikat.svg', 'KwaiKAT'], ['sapiens.svg', 'Sapiens'], ['deepcogito.png', 'Deep Cogito'],
  ['nanbeige.png', 'Nanbeige'], ['swiss-ai-initiative.png', 'Swiss AI Initiative'],
];

export const WIRBEL = {
  ariaLabel: 'Logos der Modellanbieter, mit denen wir arbeiten',
  logos: [
    // eigene Signete: nie ein Schein dahinter (Markenregel). for42 in der Fassung fuer dunklen Grund aus public/brand.
    { src: '/brand/nn-monogramm.png', name: 'NeuralNautic', schein: false },
    { src: '/brand/nn-stern-kompass-128.png', name: 'NeuralNautic', schein: false },
    { src: '/brand/partner/for42-wordmark-weiss.svg', name: 'for42.ai', breit: true, schein: false },
    ...ANBIETER.map(([d, name]) => ({ src: `/medien/ki-logos/${d}`, name })),
  ],
  hinweis: 'Wir arbeiten anbieterneutral mit den Modellen aller großen Hersteller. Die Logos gehören den jeweiligen Inhabern, eine Partnerschaft besteht nicht.',
};

export const EINSTIEG = {
  h1: ['AI-ern Sie noch –', 'oder profitieren Sie schon?'],
  // McKinsey & Company, „The state of AI in 2026: On the road to ROI“, 25.08.2026
  satz: 'Acht von zehn Befragten spüren den Nutzen von KI, nur sechs von hundert sehen ihn deutlich im Ergebnis. Mit unserer Methode <strong>Kurs, Crew, Enterprise</strong> bringen wir KI im Mittelstand dorthin, in Deutschland, Österreich und der Schweiz.',
  quelle: { text: 'Zahlen: McKinsey, The state of AI in 2026, 25.08.2026', link: { text: 'Einordnung im Ausguck', href: '/wissen' } },
  cta: { text: 'KI-Potenzialcheck buchen', href: SITE.kiCheck, extern: true },
  beruhigung: BERUHIGUNG,
  beleg: 'Frank Schütt, AI Strategy & Application Expert, geprüft bei der TÜV SÜD Akademie',
  links: [
    { text: 'So arbeiten wir: Kurs, Crew, Enterprise →', href: '/ki-im-unternehmen' },
    { text: 'Zertifikat Z-001124711 →', href: '/ueber-mich#zertifikate' },
  ],
};

/* ---------- L11: Zertifikate (auch als Miniaturen in L3) ---------- */
export const ZERTIFIKATE = [
  { bild: '/medien/zertifikate/tuev-sued-vorschau.webp', w: 509, h: 720, href: '/inhalt/cert-tuev-sued.pdf',
    titel: 'Zertifikat TÜV SÜD Akademie – AI Strategy & Application Expert (PDF)' },
  { bild: '/medien/zertifikate/neurawork-vorschau.webp', w: 720, h: 556,
    href: 'https://www.virtualbadge.io/certificate-validator?credential=f2d4fd9a-dccc-4363-ada5-287b0a2b5f01',
    titel: 'Zertifikat Neurawork – KI Applikations- und Strategieexperte (Virtualbadge)' },
];

/* ---------- L4: Manifest ---------- */
export const MANIFEST = {
  // Akzentwörter (Markenfarbe) sind Gestaltung, der Satz ist wörtlich
  titel: 'Viele Unternehmen probieren KI aus. Im Betriebsergebnis kommt sie <em>selten</em> an.',
  text: 'Der KI-Markt ist laut und unübersichtlich, neue Werkzeuge erscheinen beinahe wöchentlich. Einzelne Mitarbeitende arbeiten schneller, aber es fehlt ein Fahrplan, die Befähigung im Team oder eine Technik, die im Alltag trägt. Wir führen KI pragmatisch statt panisch ein und sprechen dabei mit Geschäftsführung, IT, Fachabteilungen, Datenschutz und Betriebsrat.',
};

/* ---------- L5: Kurs, Crew, Enterprise und die 7 Schichten ---------- */
export const METHODE = {
  titel: 'KI kommt im Betrieb an, wenn Kurs, Crew und Enterprise gleichzeitig stimmen.',
  text: 'Fehlt eines davon, bleibt es beim Experiment. Deshalb planen wir alle drei als ein Vorhaben.',
  teile: [
    { name: 'Kurs', fach: 'Strategie', claim: 'Wohin, und was lohnt sich?', desc: 'Ziele, Engpässe und Anwendungsfälle werden nach Wirkung bewertet. Ergebnis ist ein Fahrplan, den Geschäftsführung und Fachbereiche mittragen.' },
    { name: 'Crew', fach: 'Menschen und Befähigung', claim: 'Nutzung statt bloßem Wissen.', desc: 'Führungskräfte, Multiplikatoren und Teams werden so eingebunden und geschult, dass die neuen Abläufe im Alltag genutzt werden. Der Betriebsrat ist früh an Bord.' },
    { name: 'Enterprise', fach: 'KI-Architektur', claim: 'Seetüchtig statt Demo.', desc: 'Systeme, die stabil laufen, sicher sind und sich in Ihre bestehende IT einfügen, mit klarer Verantwortung für den Betrieb.' },
  ],
  link: { text: 'Methode im Detail, mit Reifegrad-Check und Architektur →', href: '/ki-im-unternehmen' },
};

// Bild bei „Schiff“: KI-generierte Animation des NeuralNautic-Schiffs (Codex, 14.11.2026), umgewandelt mit
// qa/start/schiff_umwandeln.py (nahtlose Schleife, 5,4 s). Kein Inhalt der Live-Seite.
export const SCHIFF_FILM = {
  quellen: [{ src: '/medien/schiff/schiff.webm', type: 'video/webm' }, { src: '/medien/schiff/schiff.mp4', type: 'video/mp4' }],
  poster: '/medien/schiff/schiff.webp', w: 1280, h: 720, alt: '', hinweis: KI,
};

export const SCHICHTEN = {
  titel: 'Ein seetüchtiges Schiff hat sieben Schichten, und der Datenschutz geht durch alle.',
  bild: { src: '/medien/architektur/ki-architektur-vorschau.jpg', w: 1144, h: 1880, alt: 'KI-Architektur in sieben Schichten von Infrastruktur bis Governance', href: '/ki-im-unternehmen#architektur', ariaLabel: 'KI-Architektur in sieben Schichten, mit 3D-Modell' },
  schichten: [
    ['7', 'Governance und Compliance', 'KI-Richtlinie, Rollen, Einstufung nach EU AI Act'],
    ['6', 'Datenschutz und Sicherheit', 'DSGVO, Auftragsverarbeitung, Zugriffssteuerung'],
    ['5', 'Anwendungen', 'intern und für Kunden'],
    ['4', 'Orchestrierung und Agenten', 'Arbeitsabläufe, zentraler Modellzugang (LLM-Gateway)'],
    ['3', 'Modelle', 'Cloud mit Auftragsverarbeitung, offene Modelle im eigenen Betrieb'],
    ['2', 'Daten und Wissen', 'Unternehmensdaten, Wissenssuche, Datenklassen'],
    ['1', 'Infrastruktur und Betrieb', 'Cloud, eigene Server oder hybrid, Rechenzentrum in der EU'],
  ],
  link: { text: 'Architektur im Detail, mit 3D-Modell und Grafik zum Herunterladen →', href: '/ki-im-unternehmen#architektur' },
};

/* ---------- L6: Weiche, L9: dritter Weg ---------- */
export const WEGE = {
  titel: 'Wir setzen dort an, wo Sie stehen: im ganzen Unternehmen, in einem Projekt oder bei den Werkzeugen.',
  links: { titel: 'Im Unternehmen', text: 'Fahrplan, Befähigung und Architektur für die KI-Einführung im ganzen Betrieb, mit Reifegrad-Check als Einstieg.', href: '/ki-im-unternehmen',
    bild: bild('fotoRechts', 1000, { verh: 3 / 4.2, kopf: [0.6, 0.4] }) },
  rechts: { titel: 'Im Projekt', text: 'Ein Anwendungsfall von der Potenzialanalyse über einen kontrollierten Pilot bis in den laufenden Betrieb.', href: '/methode',
    bild: bild('exoRechts', 1000, { verh: 3 / 4.2, kopf: [0.36, 0.4] }) },
  werkzeuge: { titel: 'Werkzeuge', text: 'Passende KI-Werkzeuge auswählen oder Lösungen selbst entwickeln lassen, nach Nutzen, Kosten und Datenschutz.', href: '/ki-tool-kompass', knopf: 'KI Tool Kompass' },
  alle: { text: 'Alle Leistungen im Überblick →', href: '/leistungen' },
};

/* ---------- L7: Film ---------- */
// Dateien legt der Inhalts-Agent nach public/inhalt/frank-ki/ (Namen wie auf der Live-Seite).
export const FILM = {
  video: '/inhalt/frank-ki/film.mp4',
  poster: '/inhalt/frank-ki/film.webp',
  w: 1280, h: 720,
  hinweis: KI,
  alt: 'KI-generierter Film: Frank Schütt in einer Kugel aus Unterlagen',
  knopf: { an: 'Film anhalten', aus: 'Film abspielen' },
};

/* ---------- L8: die 8 Leistungen (Kurztext und Ergebnis wörtlich aus /leistungen) ---------- */
// „teil“: Ausschnitt des Ganzkörperbilds, der auf der Karte steht (x/y in %, zoom) = das Bauteil des Exoskeletts.
// „anker“: Sprungziel auf /leistungen (die Live-Seite hat noch keine Anker, sie entstehen in Welle 2).
export const LEISTUNGEN = {
  titel: 'KI-Leistungen für Analyse, Umsetzung und Skalierung',
  text: 'Von der ersten Idee bis zum produktiven KI-gestützten Arbeitsablauf: Wir unterstützen Unternehmen dabei, KI sinnvoll, sicher und wirtschaftlich einzusetzen.',
  szene: 'frank',   // Schlüssel unter figuren.json → szenen (Ganzkörper-Szene aus @kern/hero)
  figur: { ...bild('ganzExo', 1000), klein: bild('ganzExo', 640).src, hinweis: KI },
  ergebnisLabel: 'Ergebnis',
  mehr: 'Zur Leistung im Detail',
  karten: [
    { titel: 'KI-Potenzialanalyse', anker: 'ki-potenzialanalyse', teil: { x: 50, y: 20, zoom: 3.4 },
      kurz: 'Wir identifizieren, wo künstliche Intelligenz in Ihrem Unternehmen sinnvoll eingesetzt werden kann, und wo nicht.',
      ergebnis: 'Ein klarer KI-Fahrplan mit konkreten Handlungsempfehlungen.' },
    { titel: 'KI-Architektur', anker: 'ki-architektur', teil: { x: 50, y: 41, zoom: 3.0 },
      kurz: 'Die technische Grundlage für KI, die sicher, bezahlbar und austauschbar bleibt.',
      ergebnis: 'Eine dokumentierte Zielarchitektur mit Entscheidungsvorlagen, die Ihre IT umsetzen kann, oder die wir gemeinsam umsetzen.' },
    { titel: 'Controlled Pilot', anker: 'controlled-pilot', teil: { x: 66, y: 56, zoom: 3.6 },
      kurz: 'KI sicher testen, bevor sie breit ausgerollt wird.',
      ergebnis: 'Eine belastbare Entscheidungsgrundlage: skalieren, anpassen oder stoppen.' },
    { titel: 'KI-Automatisierung', anker: 'ki-automatisierung', teil: { x: 34, y: 43, zoom: 3.4 },
      kurz: 'Wiederkehrende Aufgaben mit KI, Arbeitsabläufen und Schnittstellen automatisieren.',
      ergebnis: 'Ein produktiver KI-gestützter Arbeitsablauf mit Dokumentation, Übergabe und klaren Zuständigkeiten.' },
    { titel: 'Agentic Engineering', anker: 'agentic-engineering', teil: { x: 68, y: 33, zoom: 3.8 },
      kurz: 'Individuelle Software und Automatisierungen für Ihr konkretes Problem, entwickelt mit KI-Agenten.',
      ergebnis: 'Eine maßgeschneiderte, getestete Lösung für Ihr Problem, schneller und günstiger als klassische Individualentwicklung.' },
    { titel: 'KI-Governance und Sicherheit', anker: 'ki-governance-und-sicherheit', teil: { x: 50, y: 27, zoom: 4.2 },
      kurz: 'Klare Regeln für sicheren, nachvollziehbaren und verantwortungsvollen KI-Einsatz.',
      ergebnis: 'Ein klarer Rahmen, in dem KI sicher und akzeptiert genutzt werden kann.' },
    { titel: 'KI-Schulung und Befähigung', anker: 'ki-schulung-und-befaehigung', teil: { x: 58, y: 66, zoom: 3.4 },
      kurz: 'Mitarbeitende befähigen, KI sicher und produktiv im Arbeitsalltag einzusetzen.',
      ergebnis: 'Teams verstehen, wo KI hilft, wo Grenzen liegen und wie sie KI-Werkzeuge sicher einsetzen.' },
    { titel: 'KI Tool Kompass', anker: 'ki-tool-kompass', teil: { x: 42, y: 90, zoom: 3.4 },
      kurz: 'Bewertung und Auswahl passender KI-Werkzeuge nach Nutzen, Kosten, Datenschutz und Integrationsfähigkeit.',
      ergebnis: 'Eine fundierte Werkzeugentscheidung, die zu Ihren Prozessen, Ihrem Budget und Ihrer Datenschutzstrategie passt.' },
  ],
  cta: { text: 'KI-Potenzialcheck buchen', href: SITE.kiCheck, extern: true },
};

/* ---------- L10: Store-Platz mit dem Reifegrad-Check (Frank, 14.11.2026) ---------- */
// Fragen, Regeln und Texte wörtlich aus ki-im-unternehmen.js (dort aus ReifegradCheck.tsx). Hier wird nur zugeordnet.
const RC = REIFEGRAD.check;
export const CHECK = {
  ariaLabel: REIFEGRAD.kicker,
  fragen: RC.dimensionen.map((d) => ({ key: d.key, titel: d.title, etikett: d.quer ? RC.texte.querEtikett : '', antworten: d.levels })),
  // Auswertung ist reifegradAuswerten() der Inhalts-Datei; hier nur die Zuordnung zu den Feldern des Bausteins
  auswerten(werte) {
    const e = reifegradAuswerten(werte);
    return {
      kopf: RC.texte.ergebnisKopf(e.avg), stufe: e.stufe.n, name: e.stufe.name,
      hinweis: e.gekappt ? RC.texte.gekappt(e.vorlaeufig, e.finale) : '',
      label: RC.texte.schrittLabel, text: e.stufe.schritt, roh: e,
    };
  },
  stufeWort: 'Stufe',                                   // aus „Stufe 2: Aufbau“
  texte: {
    zaehler: (i) => RC.texte.zaehler(i),
    offen: (n) => RC.texte.offen(n),
    ergebnis: 'Ihre Einstiegsstufe',                    // aus „Ihre Einstiegsstufe · Durchschnitt …“
    neu: RC.texte.neu,
  },
  ctas: [
    { ...RC.texte.cta, art: 'accent' },
    // erster Satz des Beruhigungssatzes gehört an den Calendly-Knopf
    { text: 'KI-Potenzialcheck buchen', href: SITE.kiCheck, extern: true, art: 'linie', klein: '30 Minuten per Video, kostenlos und unverbindlich.' },
  ],
  fussnote: RC.texte.fussnote,
};

export const STORE = {
  id: REIFEGRAD.id,
  label: REIFEGRAD.kicker,
  titel: REIFEGRAD.titel,
  text: REIFEGRAD.intro,
  // Die zwei Downloads von /ki-im-unternehmen als Teaser. Die Formulare mit Einwilligung folgen in Welle 2.
  teaser: [
    { kicker: 'Checkliste zum Herunterladen', titel: 'Die ausführliche Checkliste für Ihre Leitungsrunde',
      text: 'Fünfzehn Fragen in fünf Feldern mit Auswertung, dazu eine Tabelle, mit der Sie jedes KI-Vorhaben einer Risikoklasse nach EU AI Act zuordnen. Vier Seiten als PDF zum Ausdrucken.',
      knopf: 'Checkliste herunterladen', href: '/ki-im-unternehmen#reifegrad' },
    { kicker: 'Zum Herunterladen', titel: 'Das Referenzmodell als Grafik für Ihre Unterlagen',
      text: 'Alle sieben Schichten mit Bausteinen, Datenfluss und Erläuterungen in einem Bild, verlustfrei skalierbar (SVG) für Präsentationen und Strategiepapiere.',
      knopf: 'Grafik herunterladen', href: '/ki-im-unternehmen#architektur' },
  ],
};

/* ---------- L11: wer dahintersteht ---------- */
export const VERTRAUEN = {
  titel: 'Hinter NeuralNautic stehen geprüfte Kompetenz in Strategie und Umsetzung und ein Netzwerk für größere Vorhaben.',
  text: 'Frank Schütt ist AI Strategy & Application Expert, geprüft bei der TÜV SÜD Akademie, und KI Applikations- und Strategieexperte (Neurawork). Für Vorhaben, die mehr Hände brauchen, arbeiten wir im Netzwerk von for42.ai.',
  link: { text: 'Über mich und die Zertifikate →', href: '/ueber-mich' },
  partnerLabel: 'Partner & Netzwerk',
  // Namen, Ziele und Darstellung wie PartnerBand.tsx (spring.gate und Karlson auf weißer Fläche)
  partner: [
    { name: 'FOR42.ai', href: 'https://for42.ai', logo: '/brand/partner/for42-wordmark.svg', w: 169, h: 32 },
    { name: 'spring.gate', href: 'https://funnel.springgate-ai.de', logo: '/brand/partner/springgate-logo.png', w: 140, h: 40 },
    { name: 'Karlson – One-Man-Band', href: 'https://karlson-solo-orchester.de', logo: '/brand/partner/karlson-logo.png', w: 56, h: 56 },
  ],
};

/* ---------- L12: Kanäle und Abschluss ---------- */
export const KANAELE = {
  karten: [
    { ...faecherBild('ganzExo', [0.5, 0.3]), deko: true },
    { ...faecherBild('exoRechts'), text: 'LinkedIn NeuralNautic', href: SITE.linkedinNN },
    { ...faecherBild('fotoFrontal'), text: 'LinkedIn Frank', href: SITE.linkedinFrank },
    { ...faecherBild('fotoLinks'), text: 'X @FSchuettNN', href: SITE.x },
    { ...faecherBild('ganzFoto', [0.5, 0.3]), deko: true },
  ],
  hinweis: KI,
  links: [
    { text: 'LinkedIn Frank', href: SITE.linkedinFrank },
    { text: 'LinkedIn NeuralNautic', href: SITE.linkedinNN },
    { text: 'X @FSchuettNN', href: SITE.x },
  ],
};

export const ABSCHLUSS = {
  logo: { src: '/brand/nn-monogramm.png', w: 805, h: 821 },
  titel: 'Bereit für den ersten sinnvollen KI-Schritt?',
  text: 'Wir prüfen gemeinsam, wo KI in Ihrem Unternehmen messbar Wert schafft.',
  cta: { text: 'KI-Potenzialcheck buchen', href: SITE.kiCheck, extern: true },
  beruhigung: BERUHIGUNG,
};
