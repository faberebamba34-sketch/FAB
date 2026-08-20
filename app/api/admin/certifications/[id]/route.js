const { prisma } = require("../../../../../lib/prisma");

export async function PUT(request, { params }) {
  const body = await request.json();
  const data = {};
  for (const f of ["title", "organization", "description", "imageUrl", "certificateUrl", "order"]) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  if (body.date !== undefined) data.date = body.date ? new Date(body.date) : null;

  try {
    const cert = await prisma.certification.update({ where: { id: params.id }, data });
    return Response.json(cert);
  } catch {
    return Response.json({ error: "Certification introuvable." }, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.certification.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Certification introuvable." }, { status: 404 });
  }
}
