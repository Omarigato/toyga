import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block /admin for non-admin users
  if (pathname.startsWith("/admin")) {
    // In production, verify JWT and check role === 'admin'
    // For now, check for a session cookie presence as basic guard
    const sessionToken = request.cookies.get("tg_access_token");
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Additional role check would happen server-side in the API
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
