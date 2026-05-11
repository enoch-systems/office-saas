import crypto from "crypto";

export const ADMIN_AUTH_COOKIE = "tt_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getAuthSecret() {
  // Hardcoded secret for admin authentication
  const secret = "tt_admin_secret_key_2024_secure";
  return secret;
}

function sign(input: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(input).digest("hex");
}

export function createAdminSessionToken(email: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${email}:${expiresAt}`;
  const signature = sign(payload);
  return `${payload}:${signature}`;
}

export function verifyAdminSessionToken(token: string) {
  const parts = token.split(":");
  if (parts.length < 3) {
    return null;
  }

  const email = parts[0];
  const expiresAtRaw = parts[1];
  const signature = parts.slice(2).join(":");
  const expiresAt = Number(expiresAtRaw);

  if (!email || !Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
    return null;
  }

  const payload = `${email}:${expiresAt}`;
  const expected = sign(payload);

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
    return null;
  }

  return { email };
}

export function getAdminAuthConfig() {
  // Hardcoded admin credentials
  const adminEmail = "amahchibu@gmail.com";
  const adminPassword = "123456@@";

  return { adminEmail, adminPassword };
}

export function getAdminSessionTtlSeconds() {
  return SESSION_TTL_SECONDS;
}
