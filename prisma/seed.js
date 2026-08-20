// Initialise la base : un compte admin, un profil vide, des réglages par défaut.
// Lancer avec : npm run db:seed
// Modifie ADMIN_EMAIL / ADMIN_PASSWORD dans ton .env avant de lancer ce script.

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Définis ADMIN_EMAIL et ADMIN_PASSWORD dans ton fichier .env avant de lancer le seed."
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Fabère Bamba",
      title: "Développeur Full-Stack",
      bio: "Étudiant en BTS Informatique et Développement d'Applications à l'AIBS, Abidjan.",
      email,
      socials: {},
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  console.log(`Compte admin prêt : ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
