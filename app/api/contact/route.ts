import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, company, email, phone, topic, message } = await req.json();

  if (!name || !company || !email || !topic || !message) {
    return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "NeuralNautic Kontaktformular <onboarding@resend.dev>",
    to: "frankschuettai@neuralnautic.org",
    replyTo: email,
    subject: `Neue Anfrage: ${topic} – ${name} (${company})`,
    text: `Name: ${name}
Unternehmen: ${company}
E-Mail: ${email}
Telefon: ${phone || "–"}
Anliegen: ${topic}

Nachricht:
${message}`,
  });

  if (error) {
    return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
