import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which routes require authentication
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
    "/checkout"
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the current route is protected
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAdminRoute = pathname.startsWith("/admin");
    const isLockPage = pathname === "/admin/lock";

    if (isAdminRoute && !isLockPage) {
        const adminVerified = request.cookies.get("admin-verified");
        if (!adminVerified) {
            const origin = request.nextUrl.origin;
            return NextResponse.redirect(`${origin}/admin/lock?returnUrl=${encodeURIComponent(pathname)}`);
        }
    }

    if (isProtected) {
        // Check for our mock auth cookie
        const token = request.cookies.get("auth-token");

        if (!token) {
            // If not authenticated, redirect to login with a returnUrl
            const origin = request.nextUrl.origin;
            return NextResponse.redirect(`${origin}/login?returnUrl=${encodeURIComponent(pathname)}`);
        }
    }

    return NextResponse.next();
}

// Optionally, don't run middleware on static files, api routes, etc.
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
