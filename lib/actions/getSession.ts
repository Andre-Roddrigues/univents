"use server";

import { cookies } from "next/headers";

export async function getSession() {
  const token = cookies().get("token")?.value || null;
  return { token };
}
