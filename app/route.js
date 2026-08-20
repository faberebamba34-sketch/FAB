const fs = require("fs");
const path = require("path");

// Sert ton site statique existant (site/index.html) à la racine "/",
// pendant que /admin et /api sont gérés par Next.js à côté.
export async function GET() {
  const filePath = path.join(process.cwd(), "site", "index.html");
  const html = fs.readFileSync(filePath, "utf-8");
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
