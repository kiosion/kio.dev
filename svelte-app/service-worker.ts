import { build, files, version } from '$service-worker';

const CACHE = `static-${version}`,
  ASSETS = [...files, ...build];

interface ServiceWorkerEvent extends Event {
  waitUntil: (promise: Promise<unknown>) => void;
  respondWith: (response: Promise<Response | undefined>) => void;
  request: Request;
}

self.addEventListener('install', (event) => {
  const addFilesToCache = async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  };

  (event as ServiceWorkerEvent).waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
  // remove old cached data
  const removeOldData = async () => {
    for (const key of await caches.keys()) {
      if (key !== CACHE) {
        await caches.delete(key);
      }
    }
  };

  (event as ServiceWorkerEvent).waitUntil(removeOldData());
});

self.addEventListener('fetch', (event) => {
  // ignore non-GET requests since we can't cache them
  if ((event as ServiceWorkerEvent).request?.method !== 'GET') {
    return;
  }

  const response = async () => {
    const url = new URL((event as ServiceWorkerEvent).request.url),
      cache = await caches.open(CACHE);

    // `build`/`files` can always be served from the cache
    if (ASSETS.includes(url.pathname)) {
      return cache.match((event as ServiceWorkerEvent).request);
    }

    // for everything else, try the network first, but
    // fall back to the cache if we're offline
    try {
      const response = await fetch((event as ServiceWorkerEvent).request);

      if (response.status === 200) {
        cache.put((event as ServiceWorkerEvent).request, response.clone());
      }

      return response;
    } catch {
      return cache.match((event as ServiceWorkerEvent).request);
    }
  };

  (event as ServiceWorkerEvent).respondWith(response());
});
