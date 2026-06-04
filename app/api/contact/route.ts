import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, company, email, phone, topic, message } = await req.json();

  if (!name || !company || !email || !topic || !message) {
    return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Mail-Dienst nicht konfiguriert." }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "NeuralNautic Website <onboarding@resend.dev>",
    to: "frankschuettai@neuralnautic.org",
    replyTo: email,
    subject: `Anfrage: ${topic} — ${company}`,
    text: `Name: ${name}
Unternehmen: ${company}
E-Mail: ${email}
Telefon: ${phone || "–"}
Anliegen: ${topic}

${message}`,
  });

  if (error) {
    return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
