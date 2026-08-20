const { put } = require("@vercel/blob");

export const dynamic = "force-dynamic";

// Reçoit un fichier (photo, image de projet, certificat, CV) et le stocke sur
// Vercel Blob. Protégé par le middleware (/api/admin/*) — seul l'admin connecté
// peut téléverser un fichier.
export async function POST(request) {
  const form = await request.formData();
  const file = form.get("file");

  if (!file) {
    return Response.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  const MAX_SIZE = 8 * 1024 * 1024; // 8 Mo
  if (file.size > MAX_SIZE) {
    return Response.json({ error: "Fichier trop lourd (8 Mo max)." }, { status: 400 });
  }

  const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif", "application/pdf"];
  if (!allowed.includes(file.type)) {
    return Response.json({ error: "Type de fichier non autorisé." }, { status: 400 });
  }

  try {
    const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    return Response.json({ url: blob.url });
  } catch (err) {
    return Response.json(
      { error: "Échec de l'envoi. Vérifie que BLOB_READ_WRITE_TOKEN est bien configuré." },
      { status: 500 }
    );
  }
}
