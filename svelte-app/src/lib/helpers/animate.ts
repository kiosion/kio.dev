/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, no-duplicate-imports */
import type {
  BlurParams,
  FadeParams,
  FlyParams,
  SlideParams,
  ScaleParams,
  DrawParams,
  TransitionConfig
} from 'svelte/transition';

import { blur, fade, fly, slide, scale, draw } from 'svelte/transition';

type TransitionOptions =
  | (Omit<BlurParams, 'animate' | 'fn'> & { animate: boolean; fn: 'blur' })
  | (Omit<FadeParams, 'animate' | 'fn'> & { animate: boolean; fn: 'fade' })
  | (Omit<FlyParams, 'animate' | 'fn'> & { animate: boolean; fn: 'fly' })
  | (Omit<SlideParams, 'animate' | 'fn'> & { animate: boolean; fn: 'slide' })
  | (Omit<ScaleParams, 'animate' | 'fn'> & { animate: boolean; fn: 'scale' })
  | (Omit<DrawParams, 'animate' | 'fn'> & { animate: boolean; fn: 'draw' });

const voidAnim = (
  _node: Element,
  _options: Omit<TransitionOptions, 'animate' | 'fn'>
): TransitionConfig => ({
  delay: 0,
  duration: 0,
  easing: (t) => t,
  tick: () => {},
  css: () => ''
});

const maybeAnimate = (node: Element, options: TransitionOptions) => {
  const { animate, fn, ...rest } = options;
  if (animate) {
    switch (fn) {
      case 'blur':
        return blur(node, rest as BlurParams);
      case 'fade':
        return fade(node, rest as FadeParams);
      case 'fly':
        return fly(node, rest as FlyParams);
      case 'slide':
        return slide(node, rest as SlideParams);
      case 'scale':
        return scale(node, rest as ScaleParams);
      case 'draw':
        return draw(node as SVGElement & { getTotalLength(): number }, rest);
    }
  }
  return voidAnim(node, rest);
};

export { maybeAnimate as maybe };
