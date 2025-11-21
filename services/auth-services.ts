import { cookies } from "next/headers";

export async function createSessionToken(token: string) {
  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
}

export async function getSessionToken() {
  const token = (await cookies()).get("token")?.value;
  return token || null;
}

export async function isValidSession() {
  const token = await getSessionToken();
  return !!token; // apenas verifica se existe token
}

export async function destroySession() {
  (await cookies()).delete("token");
}

const AuthServices = {
  createSessionToken,
  getSessionToken,
  isValidSession,
  destroySession,
};

export default AuthServices;
