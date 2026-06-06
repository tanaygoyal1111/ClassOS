import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that are accessible only to unauthenticated users (e.g., login, landing page)
const authRoutes = ["/login", "/register"];

// Routes that require authentication
const protectedPrefixes = [
  "/dashboard",
  "/assignments",
  "/toolkit",
  "/library",
  "/groups"
];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // 1. Check if the user is trying to access a protected route
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedRoute && !token) {
    // Unauthenticated user trying to access a protected route
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Check if the user is trying to access an auth/public route
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute && token) {
    // Authenticated user trying to access public/login page
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Ensure the middleware runs on all page navigations
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
