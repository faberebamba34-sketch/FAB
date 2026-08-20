const { prisma } = require("../../../../lib/prisma");

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return Response.json(profile);
}

export async function PUT(request) {
  const body = await request.json();
  const data = {};
  for (const f of ["name", "title", "bio", "photoUrl", "cvUrl", "email", "phone", "address", "socials"]) {
    if (body[f] !== undefined) data[f] = body[f];
  }
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  return Response.json(profile);
}
