import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/admin",
  "/learning",
  "/resources",
  "/tests",
  "/communities",
  "/sessions",
  "/codex",
  "/sandbox",
  "/checkout",
];

/** Minimal JWT structure check — three base64url segments separated by dots. */
function isValidJwtShape(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    // Verify each part is valid base64url
    parts.forEach((p) => atob(p.replace(/-/g, "+").replace(/_/g, "/")));
    // Decode payload and check expiry if present
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && Date.now() / 1000 > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.nextUrl.origin;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = pathname.startsWith("/admin");
  const isLockPage = pathname === "/admin/lock";

  // Admin secondary verification (separate from auth)
  if (isAdminRoute && !isLockPage) {
    const adminVerified = request.cookies.get("admin-verified");
    if (!adminVerified) {
      return NextResponse.redirect(
        `${origin}/admin/lock?returnUrl=${encodeURIComponent(pathname)}`
      );
    }
  }

  if (isProtected) {
    const tokenCookie = request.cookies.get("auth-token");
    const token = tokenCookie?.value;

    if (!token || !isValidJwtShape(token)) {
      // Clear any malformed/expired token cookie
      const response = NextResponse.redirect(
        `${origin}/login?returnUrl=${encodeURIComponent(pathname)}`
      );
      if (token) {
        response.cookies.delete("auth-token");
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
