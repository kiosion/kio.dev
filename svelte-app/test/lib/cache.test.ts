import { describe, expect, it } from 'vitest';
import Cache from '$lib/cache';

describe('Utils | Cache', () => {
  const model = 'someModel';
  const query = { some: 'query' };
  const queryData = {
    some: 'data',
    other: 'data'
  };

  const setupContext = () => {
    return new Cache();
  };

  it('should return a cache key', () => {
    const Store = setupContext();
    const key = Store.getCacheKey(model, query);
    expect(key).toBeDefined();
    expect(key).toBe(JSON.stringify({ model, query }));
  });

  it('should initially be empty', () => {
    const Store = setupContext();
    const key = Store.getCacheKey(model, query);
    expect(Store.has(key)).toBe(false);
  });

  it('should store and return a cache key and its value', () => {
    const Store = setupContext();
    const key = Store.getCacheKey(model, query);
    Store.set(key, queryData);
    expect(Store.has(key)).toBe(true);
    expect(Store.get(key)).toMatchObject(queryData);
  });
});
