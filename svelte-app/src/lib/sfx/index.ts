import UIfx from 'uifx';
import clickSound from './interface-click.wav';
import pingSound from './interface-error.wav';

export const click = new UIfx(clickSound, {
  volume: 0.1,
  throttleMs: 0
});

export const ping = new UIfx(pingSound, {
  volume: 0.1,
  throttleMs: 0
});
