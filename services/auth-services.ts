import { UserSession } from "@/types/types";
import * as jose from "jose";
import { cookies } from "next/headers";

export async function openSessionToken(token: string) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const { payload } = await jose.jwtVerify(token, secret);

  return payload;
}

export async function createSessionToken(payload = {}) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const session = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setExpirationTime("45d")
    .sign(secret);

  const { exp } = await openSessionToken(session);

  (await cookies()).set("session", session, {
    expires: (exp as number) * 1000,
    path: "/",
    httpOnly: false,
  });
}

export async function isValidSession() {
  const sessionToken = (await cookies()).get("session");

  if (sessionToken) {
    const { value } = sessionToken;
    const { exp } = await openSessionToken(value);
    const currentDate = new Date().getTime();

    return (exp as number) * 1000 > currentDate;
  }

  return false;
}

export async function destroySession() {
  (await cookies()).delete("session");
}

const AuthServices = {
  createSessionToken,
  openSessionToken,
  isValidSession,
};
// export async function getUser() {
//   try {
//     const token = cookies().get("session")?.value;

//     if (token && (await isValidSession())) {
//       return jose.decodeJwt(token) as UserSession;
//     }
//     return null;
//   } catch (error) {
//     console.error("Erro ao buscar usuário:", error);
//     return null;
//   }
// }
// export default AuthServices;
