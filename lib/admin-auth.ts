// 管理員工作階段：簽署 Cookie（Edge 中介層與 Node API 皆可使用）

export const ADMIN_COOKIE_NAME = 'yuguo_admin_session';

// 登入後有效期限（毫秒）
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function utf8ToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUtf8(b64url: string): string {
  const base64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
  const binary = atob(base64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// 比對簽章時避免依耗時推測內容（常數時間比較）
function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmacSha256Base64Url(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  const bytes = new Uint8Array(sig);
  let bin = '';
  bytes.forEach((c) => {
    bin += String.fromCharCode(c);
  });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// 登入成功後寫入 Cookie 的加密字串
export async function createSessionToken(secret: string): Promise<string> {
  const exp = Date.now() + SESSION_MAX_AGE_MS;
  const payload = JSON.stringify({ exp });
  const payloadB64 = utf8ToBase64Url(payload);
  const sig = await hmacSha256Base64Url(secret, payloadB64);
  return `${payloadB64}.${sig}`;
}

// 中介層與 API 用：確認 Cookie 是否有效、未過期
export async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payloadB64 || !sig) return false;
  const expectedSig = await hmacSha256Base64Url(secret, payloadB64);
  if (!timingSafeEqualStr(sig, expectedSig)) return false;
  try {
    const payload = JSON.parse(base64UrlToUtf8(payloadB64)) as { exp?: number };
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function getCookieMaxAgeSeconds(): number {
  return Math.floor(SESSION_MAX_AGE_MS / 1000);
}
