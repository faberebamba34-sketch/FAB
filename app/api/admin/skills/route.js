const { prisma } = require("../../../../lib/prisma");

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  return Response.json(skills);
}

export async function POST(request) {
  const body = await request.json();
  if (!body.name) {
    return Response.json({ error: "Le nom est requis." }, { status: 400 });
  }
  const count = await prisma.skill.count();
  const skill = await prisma.skill.create({
    data: {
      name: body.name,
      level: body.level ?? 50,
      icon: body.icon || null,
      order: body.order ?? count,
    },
  });
  return Response.json(skill, { status: 201 });
}
