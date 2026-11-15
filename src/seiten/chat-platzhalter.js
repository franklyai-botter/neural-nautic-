// Chat-Platzhalter: Knopf wie live (Kompassrose), oeffnet einen Hinweis. Sendet nichts.
// SERVER-TEIL (Welle 2): hier den echten Chat einsetzen (src/inhalt/chat.js -> CHAT, backend.js -> CHAT_API).
// Genutzt von den Kapitelseiten (gemeinsam.js) und seit 15.11.2026 auch von der Startseite (main.js).
import { hilfen } from '@kern/bausteine/index.js';
import { CHAT } from '../inhalt/chat.js';
import './chat-platzhalter.css';

const { el, esc, qs } = hilfen;

export function chatPlatzhalter() {
  const w = el(`
    <div class="ks-chat">
      <div class="ks-chat__blase" id="ks-chat-blase" role="status" hidden>
        <b>${esc(CHAT.kopf.titel)}</b><small>${esc(CHAT.kopf.etikett)}</small>
        <p>Der Chat kommt mit dem Server-Teil.</p>
      </div>
      <button class="ks-chat__knopf" type="button" aria-expanded="false" aria-controls="ks-chat-blase" aria-label="${esc(CHAT.knopf.ariaOeffnen)}">
        <img src="/brand/nn-stern-kompass-128.png" alt="" width="40" height="40" decoding="async" />
      </button>
    </div>`);
  const knopfEl = qs('.ks-chat__knopf', w);
  const blase = qs('.ks-chat__blase', w);
  const setzen = (auf) => { blase.hidden = !auf; knopfEl.setAttribute('aria-expanded', String(auf)); knopfEl.setAttribute('aria-label', auf ? CHAT.knopf.ariaSchliessen : CHAT.knopf.ariaOeffnen); };
  knopfEl.addEventListener('click', () => setzen(blase.hidden));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !blase.hidden) { setzen(false); knopfEl.focus(); } });
  return w;
}
