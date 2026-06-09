import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import type { SessionUser, UserRole } from "@/types/auth";
import { ROLES } from "@/types/auth";

const SESSION_COOKIE = "ecoride_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters long.");
  }

  return new TextEncoder().encode(secret);
}

function isUserRole(value: string): value is UserRole {
  return ROLES.includes(value as UserRole);
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    idClient: user.idClient,
    email: user.email,
    nom: user.nom,
    prenom: user.prenom,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSessionSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    const role = String(payload.role);

    if (
      typeof payload.idClient !== "number" ||
      typeof payload.email !== "string" ||
      typeof payload.nom !== "string" ||
      typeof payload.prenom !== "string" ||
      !isUserRole(role)
    ) {
      return null;
    }

    return {
      idClient: payload.idClient,
      email: payload.email,
      nom: payload.nom,
      prenom: payload.prenom,
      role,
    };
  } catch {
    return null;
  }
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    const role = String(payload.role);

    if (
      typeof payload.idClient !== "number" ||
      typeof payload.email !== "string" ||
      typeof payload.nom !== "string" ||
      typeof payload.prenom !== "string" ||
      !isUserRole(role)
    ) {
      return null;
    }

    return {
      idClient: payload.idClient,
      email: payload.email,
      nom: payload.nom,
      prenom: payload.prenom,
      role,
    };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
