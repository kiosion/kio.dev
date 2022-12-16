import { get, writable, type Writable } from 'svelte/store';

const navOpen = writable(false);

const navOptions = writable({ down: '', up: '' });

const pageHeading = writable('');

type HistoryItem = {
  internal: boolean;
  url: URL;
  title: string;
  current: boolean;
};

interface History extends Writable<HistoryItem[]> {
  push: (item: HistoryItem) => void;
  pop: () => HistoryItem | undefined;
  peek: () => HistoryItem | undefined;
  replace: (item: HistoryItem) => void;
  get: ({
    index,
    path
  }: {
    index?: number;
    path?: string;
  }) => HistoryItem[] | undefined;
}

const historyStore = writable<HistoryItem[]>([]);

const history = new Proxy(historyStore, {
  get: (target, prop) => {
    switch (prop) {
      case 'push': {
        return (item: HistoryItem) => {
          target.update((history) => [...history, item]);
        };
      }
      case 'pop': {
        return () => {
          let popped: HistoryItem | undefined;
          target.update((history) => {
            popped = history.pop();
            return history;
          });
          return popped;
        };
      }
      case 'peek': {
        return () => {
          const history = get(target);
          return history[history.length - 1];
        };
      }
      case 'replace': {
        return (item: HistoryItem) => {
          target.update((history) => {
            history.pop();
            return [...history, item];
          });
        };
      }
      case 'get': {
        return ({ index, path }: { index?: number; path?: string }) => {
          const history = get(target);
          if (index) {
            return history[index];
          }
          if (path) {
            return history.find((item) => {
              return (
                item.internal === true &&
                item.url.pathname.toLowerCase().includes(path.toLowerCase())
              );
            });
          }
          return history;
        };
      }
      default: {
        return undefined;
      }
    }
  }
}) as History;

export { history, navOpen, navOptions, pageHeading };
