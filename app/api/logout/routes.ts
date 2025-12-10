import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  const cookieOptions = {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined
  };

  res.cookies.set("token", "", cookieOptions);
  res.cookies.set("session", "", cookieOptions);

  return res;
}
