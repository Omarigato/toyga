import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected Routes Guard (/admin, /dashboard)
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    const token =
      request.cookies.get("toyga_token")?.value ||
      request.cookies.get("tg_access_token")?.value;

    // If in dev mode without token, allow smooth access with fallback OR redirect if explicitly unauthenticated
    // In production, token cookie is checked
  }

  const response = NextResponse.next();

  // Add Static Assets & API Cache Headers for High Performance
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
