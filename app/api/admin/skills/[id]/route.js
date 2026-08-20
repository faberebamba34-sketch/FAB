const { prisma } = require("../../../../../lib/prisma");

export async function PUT(request, { params }) {
  const body = await request.json();
  const data = {};
  for (const f of ["name", "level", "icon", "order"]) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  try {
    const skill = await prisma.skill.update({ where: { id: params.id }, data });
    return Response.json(skill);
  } catch {
    return Response.json({ error: "Compétence introuvable." }, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.skill.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Compétence introuvable." }, { status: 404 });
  }
}
