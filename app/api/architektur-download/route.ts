import { NextResponse } from "next/server";
import svg from "./grafik.generated";
import { leadMelden } from "../../lib/lead";

// Download der Architektur-Grafik nur gegen Name, E-Mail und Telefon (Logik in app/lib/lead.ts).
export async function POST(req: Request) {
  const fehler = await leadMelden(req, "KI-Architektur in sieben Schichten (Grafik)", "/ki-im-unternehmen");
  if (fehler) return fehler;
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": 'attachment; filename="NeuralNautic_KI-Architektur_7-Schichten.svg"',
      "Cache-Control": "no-store",
    },
  });
}
