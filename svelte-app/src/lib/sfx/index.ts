import { browser } from '$app/environment';
import { get } from 'svelte/store';
import Features from '$stores/features';

const imports = new Map<string, Promise<typeof import('*.wav')>>([
  ['click', import('./interface-click.wav')],
  ['ping', import('./interface-error.wav')]
]);

const sounds = new Map<string, HTMLAudioElement>();

const init = async (opts?: { volume: number }): Promise<void> => {
  if (!browser) {
    return;
  }

  for (const [name, file] of imports.entries()) {
    const src = (await file)?.default;

    if (!src) {
      continue;
    }

    const audio = new Audio();
    audio.src = src;
    audio.preload = 'auto';
    audio.volume = opts?.volume ?? 0.5;
    sounds.set(name, audio);
  }
};

const soundsProxy = new Proxy(sounds, {
  get: (target, prop: string) => {
    if (!browser || !get(Features.can('use sounds')) || !target.has(prop)) {
      return {
        play: () => undefined
      };
    }

    const source = target.get(prop),
      clone = source?.cloneNode(true) as HTMLAudioElement;

    clone.volume = source?.volume || 1;
    clone.preload = 'auto';
    clone.load();

    return clone;
  }
}) as unknown as { [key: string]: { play: (volume?: number) => void } };

export { soundsProxy as default, init };
