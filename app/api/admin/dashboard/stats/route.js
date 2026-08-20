const { prisma } = require("../../../../../lib/prisma");

export const dynamic = "force-dynamic";

export async function GET() {
  const [
    totalProjects,
    published,
    inProgress,
    draft,
    archived,
    skillsCount,
    certificationsCount,
    messagesCount,
    unreadCount,
    recentProjects,
    recentMessages,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.project.count({ where: { status: "IN_PROGRESS" } }),
    prisma.project.count({ where: { status: "DRAFT" } }),
    prisma.project.count({ where: { status: "ARCHIVED" } }),
    prisma.skill.count(),
    prisma.certification.count(),
    prisma.message.count(),
    prisma.message.count({ where: { status: "UNREAD" } }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return Response.json({
    projects: { total: totalProjects, published, inProgress, draft, archived },
    skillsCount,
    certificationsCount,
    messages: { total: messagesCount, unread: unreadCount },
    recentProjects,
    recentMessages,
  });
}
