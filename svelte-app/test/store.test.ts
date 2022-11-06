/* eslint-disable @typescript-eslint/require-await */
import { describe, it, expect, afterEach, vi } from 'vitest';
import StoreClass from '$lib/store';

describe('Store Class | ConstructURL', () => {
  const constructUrl = StoreClass.constructUrl;

  it('should construct a proper URL', () => {
    expect(constructUrl).toBeDefined();
    const url = constructUrl('post', { id: 1 });
    expect(url).toBe('/api/getPost?id=1');
  });

  it('should construct a URL with multiple params', () => {
    const url = constructUrl('post', { id: 1, slug: 'test' });
    expect(url).toBe('/api/getPost?id=1&slug=test');
  });

  it("should handle constructing URLs for 'many' models", () => {
    const url = constructUrl('post', { id: 1, slug: 'test' }, true);
    expect(url).toBe('/api/getPosts?id=1&slug=test');
  });
});

describe('Store Class | Query', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const Store = Object.create(StoreClass);
  const query = Store.query;

  it('should return a promise', () => {
    const fetch = async () => {
      return new Promise(() => undefined);
    };

    expect(query).toBeDefined();
    const mock = vi.fn().mockImplementation(fetch);
    const res = query(mock, 'post', { id: 1 });

    expect(res).toBeInstanceOf(Promise);
    expect(mock).toHaveBeenCalled();
    expect(mock).toHaveBeenCalledWith('/api/getPosts?id=1');
  });

  it('should wait for fetch to resolve', () => {
    let resolve: ((data: Record<string, unknown>) => void) | undefined;
    const fetch = async () => {
      return new Promise((res) => {
        resolve = res;
      });
    };

    const mock = vi.fn().mockImplementation(fetch);
    const res = query(mock, 'post', { id: 1 });
    const data = { meta: { status: 200 }, data: { something: 'important' } };

    expect(res).toBeInstanceOf(Promise);
    expect(mock).toHaveBeenCalled();
    expect(resolve).toBeDefined();

    expect(res)
      .resolves.toEqual(data)
      .catch(() => undefined);
    resolve?.(data);
  });
});

describe('Store Class | Find', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a promise', () => {
    const Store = Object.create(StoreClass);
    const find = Store.find;

    const fetch = async () => {
      return new Promise(() => undefined);
    };

    expect(find).toBeDefined();
    const mock = vi.fn().mockImplementation(fetch);
    const res = find(mock, 'post', { id: 1 });

    expect(res).toBeInstanceOf(Promise);
  });

  it('should cache result after successful fetch', async () => {
    const Store = Object.create(StoreClass);
    const find = Store.find;

    let resolve: ((data: Record<string, unknown>) => void) | undefined;
    const fetch = async () => {
      return new Promise((res) => {
        resolve = res;
      });
    };

    const mock = vi.fn().mockImplementation(fetch);
    const setSpy = vi.spyOn(Store, 'set');
    const cacheKeySpy = vi.spyOn(Store, 'getCacheKey');

    const res = find(mock, 'post', { id: 1 });
    const data = { meta: { status: 200 }, data: { something: 'important' } };

    expect(res).toBeInstanceOf(Promise);
    expect(mock).toHaveBeenCalledOnce();
    expect(resolve).toBeDefined();

    expect(res)
      .resolves.toEqual(data)
      .then(() => {
        expect(cacheKeySpy).nthCalledWith(1, 'post', { id: 1 });
        expect(cacheKeySpy).nthCalledWith(2, 'post', { id: 1 });

        expect(setSpy).toHaveBeenCalledOnce();

        const res2 = find(mock, 'post', { id: 1 });
        expect(res2).toBeInstanceOf(Promise);

        // Shouldn't fetch again
        expect(mock).toHaveBeenCalledOnce();
      })
      .catch(() => undefined);
    resolve?.(data);
  });
});
