const { PrismaClient } = require("@prisma/client");

// Évite de recréer une connexion à chaque hot-reload en dev,
// et limite le nombre de connexions en environnement serverless (Vercel).
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = { prisma };
