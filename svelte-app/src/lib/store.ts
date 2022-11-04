import CacheClass from '$lib/cache';
import { config } from '$stores/config';
import { get } from 'svelte/store';
import { API_URL } from '$lib/env';
import Logger from '$lib/logger';
import type {
  RouteFetch,
  StoreRes,
  ResData,
  ResDataMany,
  ResError,
  SiteConfig
} from '$lib/types';

interface PossibleParams {
  [key: string]: string | number | boolean | string[] | number[] | boolean[];
}

const endpoints = new Map([
  ['post', ['getPost', 'getPosts']],
  ['project', ['getProject', 'getProjects']],
  ['site', ['getConfig']],
  ['about', ['get/about']]
]);

class StoreClass extends CacheClass {
  constructUrl = (
    model: string,
    many = false,
    params: PossibleParams
  ): string => {
    const url = new URL(
      `http://localhost${API_URL}${endpoints.get(model)?.[many ? 1 : 0] ?? ''}`
    );
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length
          ? url.searchParams.append(key, value.join(','))
          : undefined;
      }
      return typeof value === 'boolean'
        ? url.searchParams.set(key, value.toString())
        : value.toString() !== '' &&
            url.searchParams.set(key, value.toString());
    });
    return url.toString().replace('http://localhost', '');
  };

  query = async <T>(
    fetch: RouteFetch,
    model: string,
    params: PossibleParams = {}
  ): Promise<StoreRes<ResDataMany<T>>> => {
    if (!endpoints.has(model)) {
      Logger.error(`Invalid model: ${model}`, 'store/query');
      return;
    }
    const url = this.constructUrl(model, true, params);
    try {
      const res = await fetch(url);
      const response = (await res.json()) as ResDataMany<T> & ResError;
      if (!response.meta || response.error) {
        Logger.error('Failed to get projects', 'store/query');
        return;
      }
      return response as ResDataMany<T>;
    } catch (err: unknown) {
      Logger.error('Failed to query endpoint', 'store/query');
      return;
    }
  };

  queryOne = async <T>(
    fetch: RouteFetch,
    model: string,
    params: PossibleParams = {}
  ): Promise<StoreRes<ResData<T>>> => {
    if (!endpoints.has(model)) {
      Logger.error(`Invalid model: ${model}`, 'store/queryOne');
      return;
    }
    const url = this.constructUrl(model, false, params);
    try {
      const res = await fetch(url);
      const response = (await res.json()) as ResData<T> & ResError;
      if (!response.meta || response.error) {
        Logger.error('Failed to get projects', 'store/queryOne');
        return;
      }
      return response as ResData<T>;
    } catch (err: unknown) {
      Logger.error('Failed to query endpoint', 'store/queryOne');
      return;
    }
  };

  find = async <T>(
    fetch: RouteFetch,
    model: string,
    params: PossibleParams = {}
  ): Promise<StoreRes<ResDataMany<T>>> => {
    const cacheKey = this.getCacheKey(model, params);
    if (this.has(cacheKey)) {
      return this.get(cacheKey) as ResDataMany<T>;
    }
    const response = await this.query(fetch, model, params);
    return response?.data
      ? (this.set(cacheKey, response) as ResDataMany<T>)
      : undefined;
  };

  findOne = async <T>(
    fetch: RouteFetch,
    model: string,
    params: PossibleParams = {}
  ): Promise<StoreRes<ResData<T>>> => {
    const cacheKey = this.getCacheKey(model, params);
    if (this.has(cacheKey)) {
      return this.get(cacheKey) as unknown as ResData<T>;
    }
    const response = await this.queryOne(fetch, model, params);
    return response?.data
      ? (this.set(cacheKey, response) as ResData<T>)
      : undefined;
  };

  findReload = async <T>(
    fetch: RouteFetch,
    model: string,
    params: PossibleParams = {}
  ): Promise<StoreRes<ResDataMany<T>>> => {
    this.delete(this.getCacheKey(model, params));
    return this.find<T>(fetch, model, params);
  };

  findReloadOne = async <T>(
    fetch: RouteFetch,
    model: string,
    params: PossibleParams = {}
  ): Promise<StoreRes<ResData<T>>> => {
    this.delete(this.getCacheKey(model, params));
    return this.findOne<T>(fetch, model, params);
  };

  findBackgroundReload = async <T>(
    fetch: RouteFetch,
    model: string,
    params: PossibleParams = {}
  ): Promise<StoreRes<ResDataMany<T>>> => {
    return this.find<T>(fetch, model, params).then((res) => {
      this.findReload<T>(fetch, model, params).catch(() => undefined);
      return res;
    });
  };

  findBackgroundReloadOne = async <T>(
    fetch: RouteFetch,
    model: string,
    params: PossibleParams = {}
  ): Promise<StoreRes<ResData<T>>> => {
    return this.findOne<T>(fetch, model, params).then((res) => {
      this.findReloadOne<T>(fetch, model, params).catch(() => undefined);
      return res;
    });
  };

  findConfig = async (
    fetch: RouteFetch
  ): Promise<StoreRes<ResData<SiteConfig>>> => {
    if (get(config)?.data) {
      return get(config);
    }
    const response = await this.queryOne(fetch, 'site');
    if (response?.data) {
      config.set(response as ResData<SiteConfig>);
    }
    return response as ResData<SiteConfig>;
  };
}

const Store = new StoreClass();

export default Store;
