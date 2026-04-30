// 聯絡表單：同一 IP 每分鐘最多幾次 POST（超過由 API 回 429）

const MAX_PER_MINUTE = 8;
const REDIS_KEY_PREFIX = 'yuguo:contact:rl:';
const REDIS_TTL_SEC = 120;

// 本機無 Redis：每分鐘每 IP 計數（單一程序有效）
const memoryCounts = new Map<string, number>();

function hasRedisEnv(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
}

// 從 Vercel／反向代理標頭取得訪客 IP（僅供節流鍵使用）
function getClientIpForRateLimit(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp.slice(0, 64);
  return 'unknown';
}

// 檢查是否超過頻率：通過回 true；超過回 false
export async function checkContactPostRateLimit(request: Request): Promise<boolean> {
  const ip = getClientIpForRateLimit(request);
  const windowMinute = Math.floor(Date.now() / 60_000);

  if (hasRedisEnv()) {
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();
      const key = `${REDIS_KEY_PREFIX}${ip}:${windowMinute}`;
      const n = await redis.incr(key);
      if (n === 1) await redis.expire(key, REDIS_TTL_SEC);
      return n <= MAX_PER_MINUTE;
    } catch {
      return true;
    }
  }

  const memKey = `${ip}:${windowMinute}`;
  const next = (memoryCounts.get(memKey) ?? 0) + 1;
  memoryCounts.set(memKey, next);
  if (memoryCounts.size > 5000) memoryCounts.clear();
  return next <= MAX_PER_MINUTE;
}
