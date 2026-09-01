import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET must be set before starting the backend.");
}

export const JWT_SECRET = jwtSecret;

export const AUTH_COOKIE_NAME = "aira_auth";

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? ("none" as const)
      : ("lax" as const),
  path: "/",
  maxAge: 60 * 60 * 1000,
};

export const getAuthToken = (
  cookieHeader?: string,
  authHeader?: string,
): string | null => {
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  if (!cookieHeader) return null;

  const cookie = cookieHeader
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${AUTH_COOKIE_NAME}=`));

  return cookie
    ? decodeURIComponent(cookie.slice(AUTH_COOKIE_NAME.length + 1))
    : null;
};
