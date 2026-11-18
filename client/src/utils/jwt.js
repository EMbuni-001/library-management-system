
export function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    const json = atob(padded);
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

export function getMillisecondsUntilExpiry(token) {
  const payload = decodeJwtPayload(token);

  if (!payload || !payload.exp) {
    return 0;
  }

  const expiryMs = payload.exp * 1000;
  const nowMs = Date.now();

  return Math.max(0, expiryMs - nowMs);
}