export const COOKIE_NAME = process.env.COOKIE_NAME || 'buildsync_token';

export function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const key = parts.shift()?.trim();
    if (key) {
      const value = decodeURIComponent(parts.join('=')?.trim());
      list[key] = value;
    }
  });

  return list;
}

export function getAuthCookie(req) {
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }
  const cookies = parseCookies(req.headers.cookie);
  return cookies[COOKIE_NAME] || null;
}

export function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';
  const isSecure = isProduction || process.env.COOKIE_SECURE === 'true';
  const sameSite = process.env.COOKIE_SAME_SITE || 'lax';

  // 1 day in seconds by default
  const maxAgeSeconds = 24 * 60 * 60;

  // Use res.cookie if available (Express), else Set-Cookie header
  if (typeof res.cookie === 'function') {
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: sameSite,
      path: '/',
      maxAge: maxAgeSeconds * 1000,
    });
  } else {
    const cookieFlags = [
      `${COOKIE_NAME}=${encodeURIComponent(token)}`,
      'Path=/',
      'HttpOnly',
      `SameSite=${sameSite}`,
      `Max-Age=${maxAgeSeconds}`,
    ];
    if (isSecure) {
      cookieFlags.push('Secure');
    }
    res.setHeader('Set-Cookie', cookieFlags.join('; '));
  }
}

export function clearAuthCookie(res) {
  const isProduction = process.env.NODE_ENV === 'production';
  const isSecure = isProduction || process.env.COOKIE_SECURE === 'true';
  const sameSite = process.env.COOKIE_SAME_SITE || 'lax';

  if (typeof res.clearCookie === 'function') {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: isSecure,
      sameSite: sameSite,
      path: '/',
    });
  } else {
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    );
  }
}
