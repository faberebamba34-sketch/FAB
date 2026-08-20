const { prisma } = require("../../../lib/prisma");

// Route publique — aucune authentification requise.
// Ne renvoie jamais les projets en "Brouillon" ou "Archivé".
export async function GET() {
  const [profile, settings, projects, skills, certifications] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.project.findMany({
      where: { status: { in: ["PUBLISHED", "IN_PROGRESS"] } },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
    prisma.certification.findMany({ orderBy: { order: "asc" } }),
  ]);

  return Response.json(
    { profile, settings, projects, skills, certifications },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}
