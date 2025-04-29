type Entry = { exp: number; value: unknown };

const map = new Map<string, Entry>();

export const DEFAULT_TTL = 1_000 * 60 * 15; // 15 minutes

export const get = <T>(key: string): T | undefined => {
  if (!map.has(key)) {
    return undefined;
  }
  const entry = map.get(key)!;
  if (entry.exp <= Date.now()) {
    map.delete(key);
    return undefined;
  }
  return entry.value as T;
};

export const set = <T>(key: string, value: T, ttl: number = DEFAULT_TTL): void => {
  map.set(key, { exp: Date.now() + ttl, value });
};
