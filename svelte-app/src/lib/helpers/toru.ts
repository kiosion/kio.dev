import { browser } from '$app/environment';
import { TORU_WS_URL } from '$lib/env';
import Logger from '$lib/logger';
import { nowPlayingData } from '$stores/navigation';

type ToruData = {
  title: string;
  playing: boolean;
  cover_art: {
    mime_type: string;
    data: string;
  };
  artist: string;
  album: string;
};

type ToruResponse = string | unknown;

let socketInstance: WebSocket | undefined,
  repeat: number | NodeJS.Timer | undefined,
  retries = 0;

const interval = 36_000;

const init = () => {
  if (!browser) {
    return;
  }

  if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
    return;
  }

  socketInstance = new WebSocket(TORU_WS_URL);

  socketInstance.addEventListener('open', () => {
    Logger.info('[ToruSync] Connected');

    retries = 0;
  });

  socketInstance.addEventListener('message', (event: MessageEvent<ToruResponse>) => {
    if (!event.data || event.data === 'pong') {
      return;
    }

    try {
      const res = JSON.parse(event.data as string) as ToruData;

      Logger.info('[ToruSync] Got update:', {}, res);

      if (res.title || res.album || res.artist) {
        nowPlayingData.set(res);
      }
    } catch (err) {
      Logger.error('[ToruSync] Failed to parse message:', {}, err as Error);
    }
  });

  socketInstance.addEventListener('close', () => {
    Logger.info('[ToruSync] Disconnected');

    stop();

    if (retries < 4) {
      retries += 1;
      setTimeout(() => {
        init();
      }, retries * 1000);
    }
  });

  repeat = setInterval(() => {
    if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
      socketInstance.send('ping');
    }
  }, interval);
};

const stop = () => {
  if (!browser || !socketInstance) {
    return;
  }

  if (repeat) {
    clearInterval(repeat);
  }

  if (socketInstance.readyState !== WebSocket.CLOSED) {
    socketInstance.close();
  }
};

export default { init, stop };

export type { ToruData as Data };
