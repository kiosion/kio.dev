import { browser } from '$app/environment';
import Logger from '$lib/logger';

export type ToruData = {
  title: string;
  playing: boolean;
  cover_art: {
    mime_type: string;
    data: string;
  };
  artist: string;
  album: string;
  streamable?: boolean;
  url?: string;
};

let socketInstance: WebSocket | undefined,
  repeat: ReturnType<typeof setInterval> | undefined,
  retries = 0;

const interval = 36_000;

export const initSync = (onUpdate: (data: ToruData) => void) => {
  if (!browser || (socketInstance && socketInstance.readyState === WebSocket.OPEN)) {
    return;
  }

  clearInterval(repeat);

  socketInstance = new WebSocket('wss://toru.kio.dev/api/v1/ws/kiosion?cover_size=large');

  socketInstance.addEventListener('open', () => {
    Logger.info('[ToruSync] Connected');
    retries = 0;
  });

  socketInstance.addEventListener('message', (event: MessageEvent<string | unknown>) => {
    if (!event.data || event.data === 'pong') {
      return;
    }

    try {
      const res = JSON.parse(event.data as string) as ToruData;

      Logger.info('[ToruSync] Received frame');

      if (res.title || res.album || res.artist) {
        onUpdate(res);
      }
    } catch (e) {
      Logger.error('[ToruSync] Error parsing', e);
    }
  });

  socketInstance.addEventListener('close', () => {
    Logger.info('[ToruSync] Disconnected');

    stop();

    // TODO: Don't run when the socket is closed intentionally
    // if (retries < 5) {
    //   retries++;
    //   clearTimeout(retry);
    //   retry = setTimeout(() => {
    //     initSync(onUpdate);
    //   }, retries * 1000);
    // }
  });

  repeat = setInterval(() => {
    if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
      socketInstance.send('ping');
    }
  }, interval);
};

export const stopSync = () => {
  if (!browser || !socketInstance) {
    return;
  }

  clearInterval(repeat);

  if (socketInstance.readyState !== WebSocket.CLOSED) {
    socketInstance.close();
  }
};
