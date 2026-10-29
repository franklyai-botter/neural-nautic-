// Rendert das Vorschaubild der Architektur-Grafik (halbe Auflösung, JPEG) nach
// public/architektur/ki-architektur-vorschau.jpg. Die volle Fassung (SVG) gibt es
// nur über das Download-Formular. Nach build_web.py laufen lassen:
//
//   node tools/architektur/vorschau.js
//
// Braucht Playwright (global installiert reicht).
const path = require("path");
const fs = require("fs");

function loadPlaywright() {
  try { return require("playwright"); } catch {}
  return require(path.join(process.env.APPDATA || "", "npm", "node_modules", "playwright"));
}

(async () => {
  const root = path.resolve(__dirname, "..", "..");
  const ts = fs.readFileSync(path.join(root, "app", "api", "architektur-download", "grafik.generated.ts"), "utf8");
  const svg = JSON.parse(ts.match(/const svg = ([\s\S]*?);\r?\nexport default/)[1]);
  const [, w, h] = svg.match(/width="(\d+)" height="(\d+)"/).map(Number);
  const scale = 0.5;
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: Math.round(w * scale), height: Math.round(h * scale) } });
  await page.setContent(`<html><body style="margin:0;background:#061419">
    <img src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}" style="width:${Math.round(w * scale)}px;display:block"></body></html>`);
  await page.waitForTimeout(400);
  const out = path.join(root, "public", "architektur", "ki-architektur-vorschau.jpg");
  await page.screenshot({ path: out, type: "jpeg", quality: 82 });
  await browser.close();
  console.log(`${path.basename(out)}: ${Math.round(w * scale)} x ${Math.round(h * scale)} px, ${Math.round(fs.statSync(out).size / 1024)} KB`);
})();
