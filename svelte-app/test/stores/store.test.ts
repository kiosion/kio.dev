import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import Cache from '@/stores/store';

describe('Stores | Cache', () => {
  const model = 'someModel';
  const query = { some: 'query' };
  const queryData = {
    some: 'data',
    other: 'data'
  };

  it('should return a cache key', () => {
    const key = Cache.getCacheKey(model, query);
    expect(Cache.getCacheKey(model, query)).toBe(
      JSON.stringify({ model, query })
    );
  });

  it('should initially be empty', () => {
    const key = Cache.getCacheKey(model, query);
    expect(Cache.has(key)).toBe(false);
  });

  it('should store a cache key and its value', () => {
    const key = Cache.getCacheKey(model, query);
    Cache.set(key, queryData);
    expect(Cache.has(key)).toBe(true);
    expect(Cache.get(key)).toMatchObject(queryData);
  });
});
