const { prisma } = require("../../../../../lib/prisma");

export const dynamic = "force-dynamic";

// PUT — change le statut : { status: "READ" | "UNREAD" | "ARCHIVED" }
export async function PUT(request, { params }) {
  const body = await request.json();
  if (!["READ", "UNREAD", "ARCHIVED"].includes(body.status)) {
    return Response.json({ error: "Statut invalide." }, { status: 400 });
  }
  try {
    const message = await prisma.message.update({
      where: { id: params.id },
      data: { status: body.status },
    });
    return Response.json(message);
  } catch {
    return Response.json({ error: "Message introuvable." }, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.message.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Message introuvable." }, { status: 404 });
  }
}
