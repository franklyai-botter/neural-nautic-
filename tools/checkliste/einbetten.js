// Bettet das fertige Checklisten-PDF als Base64 in die Download-Route ein (nicht in public/).
// Nach jedem Neubau des PDFs laufen lassen:  node tools/checkliste/einbetten.js
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const pdf = fs.readFileSync(path.join(__dirname, "NeuralNautic_KI-Checkliste_Reifegrad-und-Risiko.pdf"));
fs.writeFileSync(path.join(root, "app", "api", "checkliste-download", "checkliste.generated.ts"),
  "// Erzeugt von tools/checkliste/einbetten.js, nicht von Hand ändern.\n" +
  `const pdfBase64 = "${pdf.toString("base64")}";\nexport default pdfBase64;\n`);
console.log(`checkliste.generated.ts: ${Math.round(pdf.length / 1024)} KB PDF eingebettet`);
