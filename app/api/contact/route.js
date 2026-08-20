const { prisma } = require("../../../lib/prisma");

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json();
  const { name, email, subject, message, website } = body;

  // Honeypot anti-spam : un champ caché "website" que seuls les robots remplissent.
  if (website) {
    return Response.json({ ok: true }); // on répond "ok" sans rien enregistrer
  }

  if (!name || !email || !message) {
    return Response.json({ error: "Nom, email et message sont requis." }, { status: 400 });
  }
  if (message.length > 5000) {
    return Response.json({ error: "Message trop long." }, { status: 400 });
  }

  await prisma.message.create({
    data: { name, email, subject: subject || null, message },
  });

  return Response.json({ ok: true }, { status: 201 });
}
