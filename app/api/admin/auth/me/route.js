import { cookies } from "next/headers";
const { verifySessionToken, COOKIE_NAME } = require("../../../../../lib/auth");

export const dynamic = "force-dynamic";

export async function GET() {
  const token = cookies().get(COOKIE_NAME)?.value;
  const payload = token ? await verifySessionToken(token) : null;

  if (!payload) {
    return Response.json({ authenticated: false }, { status: 200 });
  }
  return Response.json({ authenticated: true, email: payload.email });
}
