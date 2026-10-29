// Zwei gegenläufige Laufbänder mit Werkzeug-Logos in runden Glaskacheln (Frank 29.10.2026, Vorlage
// Digital Beat „Automatisiere und verbinde deine Systeme“). Glas: .nn-glas, Bewegung: .nn-marquee
// in globals.css. Herkunft der Logos: public/werkzeug-logos/LIZENZ.txt.

const REIHEN: { datei: string; name: string }[][] = [
  [
    ["n8n-color", "n8n"], ["make-color", "Make"], ["zapier-color", "Zapier"], ["notion", "Notion"],
    ["hubspot", "HubSpot"], ["sap", "SAP"], ["datev", "DATEV"], ["googledrive", "Google Drive"],
    ["gmail", "Gmail"], ["googlesheets", "Google Sheets"], ["jira", "Jira"], ["confluence", "Confluence"],
  ],
  [
    ["dify-color", "Dify"], ["langchain-color", "LangChain"], ["github", "GitHub"], ["asana", "Asana"],
    ["airtable", "Airtable"], ["zoom", "Zoom"], ["stripe", "Stripe"], ["shopify", "Shopify"],
    ["mailchimp", "Mailchimp"], ["odoo", "Odoo"], ["personio", "Personio"], ["trello", "Trello"], ["discord", "Discord"],
  ],
].map((r) => r.map(([d, name]) => ({ datei: `/werkzeug-logos/${d}.svg`, name })));

export default function WerkzeugLaufband() {
  return (
    <div role="img" aria-label={`Systeme, die wir anbinden: ${REIHEN.flat().map((l) => l.name).join(", ")}`}
      style={{ display: "grid", gap: 18 }}>
      {REIHEN.map((reihe, r) => (
        <div key={r} className="nn-marquee" style={{ padding: "18px 0" }}>
          <div className="nn-marquee-track" style={{ animationDirection: r === 1 ? "reverse" : "normal", animationDuration: r === 1 ? "48s" : "40s" }}>
            {/* Inhalt doppelt gesetzt: von -50 % nach 0 ergibt eine nahtlose Schleife */}
            {[0, 1].map((kopie) => (
              <div key={kopie} aria-hidden={kopie === 1 ? "true" : undefined} style={{ display: "flex" }}>
                {/* Reihe zweimal je Hälfte: eine Hälfte muss breiter sein als der Bildschirm, sonst bleibt rechts eine Lücke */}
                {[...reihe, ...reihe].map((l, i) => (
                  <div key={`${l.datei}-${i}`} title={l.name} className="nn-glas nn-werkzeug-kachel" style={{ margin: "0 10px" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- Logos unverändert, feste Größe */}
                    <img src={l.datei} alt="" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
