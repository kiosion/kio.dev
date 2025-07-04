import { browser } from '$app/environment';
import { type APIResponse, isAPISuccess } from '$lib/api/types';

const cache = new Map<string, { data: unknown; expires: number }>();

const CACHE_TTL = 15 * 60 * 1000; // 15mins

const set = <T>(key: string, data: T, ttl: number = CACHE_TTL): void => {
  if (!browser) {
    return;
  }
  cache.set(key, { data, expires: Date.now() + ttl });
};

const get = <T>(key: string): T | undefined => {
  if (!browser) {
    return undefined;
  }

  const cached = cache.get(key);
  if (!cached) {
    return undefined;
  }

  if (Date.now() > cached.expires) {
    cache.delete(key);
    return undefined;
  }

  return cached.data as T;
};

export const cacheKey = (prefix: string, params?: Record<string, unknown>) =>
  `${prefix}:${JSON.stringify(params)}`;

export const withCache = async <T>(
  key: string,
  fn: () => Promise<APIResponse<T>>
): Promise<APIResponse<T>> => {
  const cached = get<APIResponse<T>>(key);
  if (cached) {
    return cached;
  }
  const result = await fn();
  if (isAPISuccess(result)) {
    set(key, result);
  }
  return result;
};
