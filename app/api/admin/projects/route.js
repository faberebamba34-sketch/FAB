const { prisma } = require("../../../../lib/prisma");

// GET — liste tous les projets (tous statuts confondus), pour l'admin
export async function GET() {
  const projects = await prisma.project.findMany({
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return Response.json(projects);
}

// POST — crée un nouveau projet
export async function POST(request) {
  const body = await request.json();

  if (!body.title) {
    return Response.json({ error: "Le titre est requis." }, { status: 400 });
  }

  const slug =
    body.slug ||
    body.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  try {
    const project = await prisma.project.create({
      data: {
        title: body.title,
        slug,
        description: body.description || "",
        technologies: body.technologies || [],
        githubUrl: body.githubUrl || null,
        demoUrl: body.demoUrl || null,
        category: body.category || null,
        projectDate: body.projectDate ? new Date(body.projectDate) : null,
        status: body.status || "DRAFT",
        featured: !!body.featured,
        mainImageUrl: body.mainImageUrl || null,
        images: body.images?.length
          ? { create: body.images.map((url, i) => ({ url, order: i })) }
          : undefined,
      },
      include: { images: true },
    });
    return Response.json(project, { status: 201 });
  } catch (err) {
    if (err.code === "P2002") {
      return Response.json({ error: "Un projet avec ce slug existe déjà." }, { status: 409 });
    }
    return Response.json({ error: "Erreur lors de la création du projet." }, { status: 500 });
  }
}
