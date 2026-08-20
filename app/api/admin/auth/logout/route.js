const { COOKIE_NAME } = require("../../../../../lib/auth");

export const dynamic = "force-dynamic";

export async function POST() {
  const response = Response.json({ ok: true });
  response.headers.set(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  );
  return response;
}
