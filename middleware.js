import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

// Routes qui ne doivent JAMAIS être protégées, même si elles commencent par /admin ou /api/admin
const PUBLIC_EXCEPTIONS = ["/admin/login", "/api/admin/auth/login"];

async function isValidSession(token) {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtectedPage = pathname.startsWith("/admin");
  const isProtectedApi = pathname.startsWith("/api/admin");
  const isException = PUBLIC_EXCEPTIONS.some((p) => pathname.startsWith(p));

  if ((isProtectedPage || isProtectedApi) && !isException) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const valid = await isValidSession(token);

    if (!valid) {
      if (isProtectedApi) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
