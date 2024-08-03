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

const onOpen = () => {
  Logger.info('[ToruSync] Connected');
  retries = 0;
};

const onClose = () => {
  Logger.info('[ToruSync] Disconnected');
  stop();
};

const onError = (e: Event) => {
  Logger.error('[ToruSync] Error', e);
};

const onMessage =
  (onUpdate: (data: ToruData) => void) => (e: MessageEvent<string | unknown>) => {
    if (!e.data || e.data === 'pong') {
      return;
    }

    try {
      const res = JSON.parse(e.data as string) as ToruData;

      Logger.info('[ToruSync] Received frame');

      if (res.title || res.album || res.artist) {
        onUpdate(res);
      }
    } catch (e) {
      Logger.error('[ToruSync] Error parsing', e);
    }
  };

export const initSync = (onUpdate: (data: ToruData) => void) => {
  if (!browser || (socketInstance && socketInstance.readyState === WebSocket.OPEN)) {
    return;
  }

  clearInterval(repeat);

  socketInstance = new WebSocket('wss://toru.kio.dev/api/v1/ws/kiosion?cover_size=large');

  socketInstance.addEventListener('open', onOpen);
  socketInstance.addEventListener('message', onMessage(onUpdate));
  socketInstance.addEventListener('error', onError);
  socketInstance.addEventListener('close', onClose);

  repeat = setInterval(() => {
    if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
      socketInstance.send('ping');
    }
  }, interval);
};

export const stopSync = (onUpdate: (data: ToruData) => void) => {
  if (!browser || !socketInstance) {
    return;
  }

  clearInterval(repeat);

  if (socketInstance.readyState !== WebSocket.CLOSED) {
    socketInstance.close();
  }

  socketInstance.removeEventListener('open', onOpen);
  socketInstance.removeEventListener('message', onMessage(onUpdate));
  socketInstance.removeEventListener('error', onError);
  socketInstance.removeEventListener('close', onClose);

  socketInstance = undefined;
};
