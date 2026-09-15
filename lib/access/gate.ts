import { timingSafeEqual } from 'node:crypto';

export type AccessConfig = { passwordHash: string; signingKey: string };
export const sessionCookie = '__Host-pa_vanguard_access';
const sessionSeconds = 8 * 60 * 60;
const encoder = new TextEncoder();
export async function hashPassword(password: string) {
  return Buffer.from(
    await crypto.subtle.digest('SHA-256', encoder.encode(password)),
  ).toString('hex');
}
async function hmac(value: string, key: string) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return Buffer.from(
    await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(value)),
  ).toString('base64url');
}
function equal(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
export function configured(config: AccessConfig) {
  return (
    /^[a-f0-9]{64}$/.test(config.passwordHash) && config.signingKey.length >= 32
  );
}
export async function createSession(config: AccessConfig, now = Date.now()) {
  const expiry = Math.floor(now / 1000) + sessionSeconds;
  const payload = `${expiry}.${config.passwordHash.slice(0, 16)}.${crypto.randomUUID()}`;
  return `${payload}.${await hmac(payload, config.signingKey)}`;
}
export async function validSession(
  request: Request,
  config: AccessConfig,
  now = Date.now(),
) {
  if (!configured(config)) return false;
  const cookies = request.headers.get('cookie') || '';
  const tokens = cookies
    .split(';')
    .map((c) => c.trim())
    .filter((c) => c.startsWith(`${sessionCookie}=`));
  if (tokens.length !== 1) return false;
  const token = tokens[0].slice(sessionCookie.length + 1);
  if (token.length > 256) return false;
  const parts = token.split('.');
  if (parts.length !== 4) return false;
  const [expiry, version, nonce, signature] = parts;
  const seconds = Math.floor(now / 1000);
  if (
    !/^\d+$/.test(expiry) ||
    Number(expiry) <= seconds ||
    Number(expiry) > seconds + sessionSeconds ||
    version !== config.passwordHash.slice(0, 16) ||
    !/^[a-f0-9-]{36}$/.test(nonce)
  )
    return false;
  return equal(
    signature,
    await hmac(parts.slice(0, 3).join('.'), config.signingKey),
  );
}
function responseHeaders() {
  return new Headers({
    'Cache-Control': 'private, no-store, max-age=0',
    'CDN-Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin',
    Vary: 'Cookie',
    'X-Frame-Options': 'DENY',
  });
}
export function privateResponse(response: Response) {
  const headers = new Headers(response.headers);
  responseHeaders().forEach((value, key) => headers.set(key, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
function loginPage(message = '', status = 200) {
  const headers = responseHeaders();
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set(
    'Content-Security-Policy',
    "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  );
  return new Response(
    `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Protected access | PA × Vanguard</title><link rel="icon" href="/favicon.svg"><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#102e35;color:#182d34;font:16px Arial,Helvetica,sans-serif;display:grid;place-items:center;padding:24px}.card{background:#fff;border:1px solid #dce5e7;border-radius:12px;padding:42px;width:min(100%,450px);box-shadow:0 22px 80px #00141b44}.brand{display:flex;align-items:center;gap:23px;border-bottom:1px solid #e0e6e8;padding-bottom:29px;margin-bottom:32px}.pa{width:44px;height:40px}.vg{width:137px;height:auto}.brand span{color:#91a2a8}.eyebrow{font-size:11px;letter-spacing:1.7px;color:#a4142b;font-weight:700;margin-bottom:13px}h1{font-size:28px;font-weight:600;letter-spacing:-.7px;margin:0 0 15px}p{line-height:1.7;color:#607681;font-size:15px;margin:0 0 27px}label{font-size:14px;font-weight:600;display:block;margin-bottom:10px}input{width:100%;font:16px Arial;border:1px solid #c7d5db;border-radius:5px;padding:14px;color:#17333d}input:focus{outline:2px solid #598c9a;outline-offset:2px}button{margin-top:19px;width:100%;padding:14px;border:0;border-radius:5px;background:#a4142b;color:#fff;font-size:15px;font-weight:600;cursor:pointer}button:hover{background:#861026}button:focus-visible{outline:2px solid #598c9a;outline-offset:3px}.note{font-size:12px;color:#809198;margin:23px 0 0;line-height:1.65}.error{padding:12px 14px;background:#fff0f0;border:1px solid #edc7ce;border-radius:5px;color:#8b2336;font-size:14px;margin-bottom:20px}@media(max-width:480px){.card{padding:29px}}</style></head><body><main class="card"><div class="brand"><img class="pa" src="/brand/pa-consulting.svg" alt="PA Consulting"><span>×</span><img class="vg" src="/brand/vanguard.svg" alt="Vanguard"></div><div class="eyebrow">LICENCE TO OPERATE</div><h1>Your shared workspace.</h1><p>Enter the password shared with you to access the PA × Vanguard learning playbook.</p>${message ? `<div class="error" role="alert">${message}</div>` : ''}<form method="post" action="/access/unlock"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256" autofocus><button type="submit">Unlock the playbook &nbsp; →</button></form><p class="note">Access is for invited colleagues. Ask the person who shared this link if you need the password.</p></main></body></html>`,
    { status, headers },
  );
}
async function boundedBody(request: Request) {
  if (Number(request.headers.get('content-length') || 0) > 4096)
    throw new Error('too-large');
  if (!request.body) return '';
  const reader = request.body.getReader();
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      size += result.value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        throw new Error('too-large');
      }
      chunks.push(result.value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks).toString('utf8');
}
/** Returns null only when the request is allowed to reach the application. */
export async function accessGate(
  request: Request,
  config: AccessConfig,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (
    [
      '/brand/pa-consulting.svg',
      '/brand/vanguard.svg',
      '/favicon.svg',
    ].includes(url.pathname) &&
    ['GET', 'HEAD'].includes(request.method)
  )
    return null;
  if (url.pathname === '/robots.txt')
    return privateResponse(
      new Response('User-agent: *\nDisallow: /\n', {
        headers: { 'Content-Type': 'text/plain' },
      }),
    );
  if (!configured(config))
    return loginPage(
      'Access is being configured. Please try again later.',
      503,
    );
  if (url.pathname === '/access/unlock' || url.pathname === '/access/lock') {
    if (request.method !== 'POST')
      return privateResponse(
        new Response('Method not allowed', {
          status: 405,
          headers: { Allow: 'POST' },
        }),
      );
    // Browser forms send Origin; reject cross-origin and missing-origin writes.
    if (request.headers.get('origin') !== url.origin)
      return privateResponse(
        new Response('Request origin not allowed', { status: 403 }),
      );
    if (url.pathname === '/access/lock') {
      const headers = responseHeaders();
      headers.set('Location', '/');
      headers.set(
        'Set-Cookie',
        `${sessionCookie}=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0`,
      );
      return new Response(null, { status: 303, headers });
    }
    if (
      !request.headers
        .get('content-type')
        ?.startsWith('application/x-www-form-urlencoded')
    )
      return loginPage('Please use the password form to unlock the site.', 415);
    let password: string;
    try {
      const params = new URLSearchParams(await boundedBody(request));
      if (params.getAll('password').length !== 1)
        return loginPage('Enter the shared password to continue.', 400);
      password = params.get('password') || '';
    } catch {
      return loginPage('The request was too large. Please try again.', 413);
    }
    if (
      !password ||
      password.length > 256 ||
      !equal(await hashPassword(password), config.passwordHash)
    )
      return loginPage('That password is not correct. Please try again.', 401);
    const headers = responseHeaders();
    headers.set('Location', '/');
    headers.set(
      'Set-Cookie',
      `${sessionCookie}=${await createSession(config)}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${sessionSeconds}`,
    );
    return new Response(null, { status: 303, headers });
  }
  if (await validSession(request, config)) return null;
  if (
    url.pathname.startsWith('/api/') ||
    url.searchParams.has('_rsc') ||
    request.headers.get('rsc') === '1'
  )
    return privateResponse(
      Response.json({ error: 'Password required' }, { status: 401 }),
    );
  if (
    url.pathname.startsWith('/_next/') ||
    /\.(js|json|map|css)$/.test(url.pathname)
  )
    return privateResponse(new Response('Password required', { status: 401 }));
  return loginPage();
}
