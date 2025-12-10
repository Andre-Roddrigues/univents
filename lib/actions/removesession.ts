"use server";

import { cookies } from "next/headers";

export async function removeSession() {
  const cookieStore = cookies();

  // Apagar cookies com mesmo path
  cookieStore.set("token", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  cookieStore.set("session", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return { success: true };
}
