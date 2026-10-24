import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "school_outreach_session";

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const password = process.env.APP_PASSWORD;
    if (!password) return false;
    if (!token) return false;
    // simple token check
    return token === Buffer.from(password).toString("base64");
  } catch {
    return false;
  }
}

export async function setAuthCookie() {
  const cookieStore = await cookies();
  const password = process.env.APP_PASSWORD;
  if (!password) throw new Error("APP_PASSWORD not configured");
  const token = Buffer.from(password).toString("base64");
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function requireAuthFromRequest(req: NextRequest): boolean {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const password = process.env.APP_PASSWORD;
  if (!password || !cookie) return false;
  return cookie === Buffer.from(password).toString("base64");
}
