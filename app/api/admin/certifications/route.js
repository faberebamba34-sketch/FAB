const { prisma } = require("../../../../lib/prisma");

export async function GET() {
  const certifications = await prisma.certification.findMany({ orderBy: { order: "asc" } });
  return Response.json(certifications);
}

export async function POST(request) {
  const body = await request.json();
  if (!body.title || !body.organization) {
    return Response.json({ error: "Titre et organisme requis." }, { status: 400 });
  }
  const count = await prisma.certification.count();
  const cert = await prisma.certification.create({
    data: {
      title: body.title,
      organization: body.organization,
      description: body.description || null,
      date: body.date ? new Date(body.date) : null,
      imageUrl: body.imageUrl || null,
      certificateUrl: body.certificateUrl || null,
      order: body.order ?? count,
    },
  });
  return Response.json(cert, { status: 201 });
}
