
// JWTs are three base64-encoded parts separated by dots:
// header.payload.signature
// We only need the payload to read the expiry.
export function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Base64URL uses - and _ instead of + and /, and may omit padding.
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    const json = atob(padded);
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

// Returns the number of milliseconds until the token expires,
// or 0 if it's already expired or can't be decoded.
export function getMillisecondsUntilExpiry(token) {
  const payload = decodeJwtPayload(token);

  if (!payload || !payload.exp) {
    return 0;
  }

  const expiryMs = payload.exp * 1000; // JWT exp is in seconds
  const nowMs = Date.now();

  return Math.max(0, expiryMs - nowMs);
}