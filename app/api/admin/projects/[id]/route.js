const { prisma } = require("../../../../../lib/prisma");

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!project) return Response.json({ error: "Projet introuvable." }, { status: 404 });
  return Response.json(project);
}

// PUT — met à jour n'importe quel champ, y compris un changement rapide de statut ou "à la une"
export async function PUT(request, { params }) {
  const body = await request.json();

  const data = {};
  const fields = [
    "title",
    "slug",
    "description",
    "technologies",
    "githubUrl",
    "demoUrl",
    "category",
    "status",
    "featured",
    "mainImageUrl",
    "order",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  if (body.projectDate !== undefined) {
    data.projectDate = body.projectDate ? new Date(body.projectDate) : null;
  }

  try {
    const project = await prisma.project.update({
      where: { id: params.id },
      data,
      include: { images: true },
    });

    // Remplacement complet de la galerie d'images si une nouvelle liste est fournie
    if (Array.isArray(body.images)) {
      await prisma.projectImage.deleteMany({ where: { projectId: params.id } });
      if (body.images.length) {
        await prisma.projectImage.createMany({
          data: body.images.map((url, i) => ({ projectId: params.id, url, order: i })),
        });
      }
    }

    const updated = await prisma.project.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { order: "asc" } } },
    });
    return Response.json(updated);
  } catch (err) {
    if (err.code === "P2025") {
      return Response.json({ error: "Projet introuvable." }, { status: 404 });
    }
    return Response.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.project.delete({ where: { id: params.id } });
    return Response.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") {
      return Response.json({ error: "Projet introuvable." }, { status: 404 });
    }
    return Response.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }
}
