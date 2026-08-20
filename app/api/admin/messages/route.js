const { prisma } = require("../../../../lib/prisma");

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // UNREAD | READ | ARCHIVED | null (tous)

  const messages = await prisma.message.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return Response.json(messages);
}
