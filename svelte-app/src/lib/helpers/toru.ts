import { TORU_API_URL } from '$lib/consts';
import { nowPlayingData } from '$stores/navigation';
import { browser } from '$app/environment';
import Logger from '$lib/logger';
import type { RouteFetch } from '$types';

type Response =
  | {
      status: 200;
      data: {
        title: string;
        playing: boolean;
        cover_art: {
          mime_type: string;
          data: string;
        };
        artist: string;
        album: string;
      };
      message: never;
      detail: never;
    }
  | {
      status: number;
      data: never;
      message: string;
      detail?: string;
    };

export type Data = Exclude<Response['data'], undefined>;

class ToruSync {
  private interval: number;

  private repeat?: number | NodeJS.Timer;

  private callback: (data: Data) => void;

  private _fetch!: RouteFetch;

  private lastData: Data | undefined;

  constructor() {
    this.interval = 36_000;
    this.callback = (data: Data) => {
      nowPlayingData.set(data);
    };
    this.lastData = undefined;
  }

  private update = async () => {
    try {
      const res = await this._fetch(TORU_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

      const data = (await res.json()) as Response;

      if (data.status !== 200) {
        throw new Error(
          `${data.message}${data.detail ? `: ${data.detail}` : ''}`
        );
      }

      return data.data;
    } catch (err) {
      Logger.error('[ToruSync] Failed to load status', {}, err);
    }
  };

  public start(fetch: RouteFetch): void {
    if (!browser) {
      return;
    }
    if (!this._fetch) {
      this._fetch = fetch;
      this.sync();
    }
  }

  public stop(): void {
    clearInterval(this.repeat);
  }

  private async sync(): Promise<void> {
    if (!document?.hidden) {
      const data = await this.update();

      if (data && data !== this.lastData) {
        this.lastData = data;
        this.callback(data);
      }
    }

    this.repeat ||= setInterval(() => this.sync(), this.interval);
  }
}

export default new ToruSync();
