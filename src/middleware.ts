import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /checkout (not /checkout/login)
  if (pathname === "/checkout" || pathname.startsWith("/checkout/") && !pathname.startsWith("/checkout/login")) {
    // Skip login page
    if (pathname === "/checkout/login") {
      return NextResponse.next();
    }

    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) {
      return NextResponse.redirect(new URL("/checkout/login", req.url));
    }

    const token = req.cookies.get("admin_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/checkout/login", req.url));
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(sessionSecret));
      return NextResponse.next();
    } catch {
      // Invalid/expired token — clear cookie and redirect
      const response = NextResponse.redirect(new URL("/checkout/login", req.url));
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*"],
};
