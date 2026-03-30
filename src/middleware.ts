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

const instructorRoutes = ["/instructor"];

/** Minimal JWT structure check — three base64url segments separated by dots. */
function isValidJwtShape(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    parts.forEach((p) => atob(p.replace(/-/g, "+").replace(/_/g, "/")));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && Date.now() / 1000 > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

function getRoleFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.role ?? "student";
  } catch {
    return "student";
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
      const response = NextResponse.redirect(
        `${origin}/login?returnUrl=${encodeURIComponent(pathname)}`
      );
      if (token) {
        response.cookies.delete("auth-token");
      }
      return response;
    }

    // Instructor-only route guard
    if (instructorRoutes.some((r) => pathname.startsWith(r))) {
      const role = getRoleFromToken(token);
      if (role !== "instructor" && role !== "admin") {
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
