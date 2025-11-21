import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidSession } from "./services/auth-services";

export async function middleware(req: NextRequest) {
  const session = await isValidSession();
  const { pathname } = req.nextUrl;

  if (
    (pathname.startsWith("/checkout") || pathname.startsWith("/user")) &&
    !session
  ) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/verify-otp") && session) {
    const redirectUrl = req.nextUrl.searchParams.get("redirect") || "/eventos";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  return NextResponse.next();
}

// Configuração do middleware
export const config = {
  matcher: ["/checkout/:path*", "/user/:path*", "/login", "/verify-otp"],
};
