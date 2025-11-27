import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidSession } from "./services/auth-services";

export async function middleware(req: NextRequest) {
  const session = await isValidSession();
  const { pathname, search } = req.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/perfil");

  // ============================================
  // ❌ Caso NÃO tenha sessão, bloquear rota protegida
  // ============================================
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(redirectUrl);
  }

  // ============================================
  // ✔️ Usuário já logado mas tentando acessar /login ou /verify-otp
  // ============================================
  if ((pathname === "/login" || pathname === "/verify-otp") && session) {
    const redirectTo = req.nextUrl.searchParams.get("redirect") || "/eventos";
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.next();
}

// ============================================
// CONFIGURAÇÃO
// Bloqueia:
// - /checkout e /checkout/[id]
// - /perfil e /perfil/alguma-coisa
// - Evita acesso ao login quando já logado
// ============================================
export const config = {
  matcher: [
    "/checkout/:path*",
    "/perfil/:path*",
    "/login",
    "/verify-otp",
  ],
};
