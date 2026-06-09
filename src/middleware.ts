import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccessRoute } from "@/lib/auth/roles";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";

const PROTECTED_PREFIXES = ["/compte", "/atelier", "/admin"];
const AUTH_PAGES = ["/connexion", "/inscription"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthPage = AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  );

  if (isProtected && !session) {
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isProtected && !canAccessRoute(session.role, pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (session && isAuthPage) {
    const redirectPath =
      session.role === "admin"
        ? "/admin"
        : session.role === "technicien"
          ? "/atelier"
          : "/compte";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/compte/:path*", "/atelier/:path*", "/admin/:path*", "/connexion", "/inscription"],
};
