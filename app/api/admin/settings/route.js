const { prisma } = require("../../../../lib/prisma");

export async function GET() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return Response.json(settings);
}

export async function PUT(request) {
  const body = await request.json();
  const data = {};
  for (const f of ["siteTitle", "metaDescription", "footerText"]) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  return Response.json(settings);
}
