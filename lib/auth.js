const { SignJWT, jwtVerify } = require("jose");

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = "8h";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET manquant dans les variables d'environnement.");
  }
  return new TextEncoder().encode(secret);
}

async function createSessionToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

module.exports = { COOKIE_NAME, createSessionToken, verifySessionToken };
