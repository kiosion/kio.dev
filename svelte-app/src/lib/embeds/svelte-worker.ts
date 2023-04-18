export const createWorker = () => {
  const worker = new Worker('/scripts/svelte-worker.js');
  return {
    async bundle(code: string) {
      return new Promise((resolve, reject) => {
        try {
          const id = Date.now(),
            handleMessage = (event: MessageEvent) => {
              if (event?.data.id === id) {
                worker.removeEventListener('message', handleMessage);
                resolve(event.data.result);
              }
            };
          worker.addEventListener('message', handleMessage);
          worker.postMessage({ id, code });
        } catch (e: unknown) {
          reject(e);
        }
      });
    }
  };
};
