import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected Routes Guard (/admin, /dashboard)
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    const token =
      request.cookies.get("toyga_token")?.value ||
      request.cookies.get("tg_access_token")?.value;

    // Check if token exists in cookies; if absent in production mode, redirect to /login
    if (!token && process.env.NODE_ENV === "production") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // Cache headers for static assets
  if (
    pathname.startsWith("/_next/static") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".mp3")
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/_next/static/:path*"],
};
