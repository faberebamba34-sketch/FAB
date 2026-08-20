const bcrypt = require("bcryptjs");
const { prisma } = require("../../../../../lib/prisma");
const { createSessionToken, COOKIE_NAME } = require("../../../../../lib/auth");

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email et mot de passe requis." }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { email } });

    // Même message d'erreur que l'utilisateur existe ou non — évite de révéler
    // quels emails sont enregistrés.
    if (!user) {
      return Response.json({ error: "Identifiants invalides." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return Response.json({ error: "Identifiants invalides." }, { status: 401 });
    }

    const token = await createSessionToken({ sub: user.id, email: user.email });

    const response = Response.json({ ok: true });
    response.headers.set(
      "Set-Cookie",
      `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${8 * 60 * 60}`
    );
    return response;
  } catch (err) {
    // On log le vrai message côté serveur (visible dans les logs Vercel),
    // et on renvoie toujours du JSON exploitable côté client — jamais une
    // page d'erreur brute qui casse le "res.json()" du formulaire.
    console.error("Login error:", err);
    const hint = err.message?.includes("SESSION_SECRET")
      ? "SESSION_SECRET manquant côté serveur."
      : err.message?.includes("datasource")
        ? "Connexion à la base de données impossible."
        : "Erreur serveur inattendue.";
    return Response.json({ error: hint }, { status: 500 });
  }
}
