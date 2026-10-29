import { NextResponse } from "next/server";
import pdfBase64 from "./checkliste.generated";
import { leadMelden } from "../../lib/lead";

// Download der KI-Checkliste (Reifegrad und Risiko, nach for42-Readiness-Check von Olaf Pick)
// nur gegen Name, E-Mail und Telefon. PDF-Quelle: tools/checkliste/, eingebettet per
// tools/checkliste/einbetten.js. Liegt bewusst nicht in public/.
export async function POST(req: Request) {
  const fehler = await leadMelden(req, "KI-Checkliste Reifegrad und Risiko (PDF)", "/ki-im-unternehmen");
  if (fehler) return fehler;
  return new NextResponse(Buffer.from(pdfBase64, "base64"), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="NeuralNautic_KI-Checkliste_Reifegrad-und-Risiko.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
