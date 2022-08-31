import { get } from 'svelte/store';
import { state } from '$stores/menu';
import type { MenuStateOpt, PixelIcon } from '$lib/types';

const ArrowLeft = (): Promise<PixelIcon> =>
  import('pixelarticons/svg/arrow-left.svg').then((Icon) => Icon.default);
const ArrowRight = (): Promise<PixelIcon> =>
  import('pixelarticons/svg/arrow-right.svg').then((Icon) => Icon.default);
const Open = (): Promise<PixelIcon> =>
  import('pixelarticons/svg/open.svg').then((Icon) => Icon.default);
const Copy = (): Promise<PixelIcon> =>
  import('pixelarticons/svg/copy.svg').then((Icon) => Icon.default);
const Link = (): Promise<PixelIcon> =>
  import('pixelarticons/svg/link.svg').then((Icon) => Icon.default);
const Save = (): Promise<PixelIcon> =>
  import('pixelarticons/svg/save.svg').then((Icon) => Icon.default);
const Code = (): Promise<PixelIcon> =>
  import('pixelarticons/svg/code.svg').then((Icon) => Icon.default);
const Reload = (): Promise<PixelIcon> =>
  import('pixelarticons/svg/reload.svg').then((Icon) => Icon.default);
const Cast = (): Promise<PixelIcon> =>
  import('pixelarticons/svg/cast.svg').then((Icon) => Icon.default);

export const setState = async (e?: MouseEvent, pageContainer?: HTMLElement) => {
  if (!e) {
    return state.set({
      ...get(state),
      open: false
    });
  }

  let target = e.target as HTMLElement;
  target = target?.closest('code') || target;
  target = target?.closest('button') || target;
  target = target?.closest('a') || target;

  const opts = (await (async () => {
    switch (target?.tagName.toUpperCase()) {
      case 'A':
        return [
          {
            icon: Link,
            text: `Go to '${target.href}'`,
            action: () => window.open(target.href, '_self')
          },
          {},
          {
            icon: Open,
            text: 'Open link in new tab',
            action: () => window.open(target.href, '_blank')
          },
          {
            icon: Open,
            text: 'Open link in new window',
            action: () =>
              window.open(target.href, '_blank', 'width=1200, height=800')
          },
          {},
          {
            icon: Copy,
            text: 'Copy link address',
            action: () => navigator.clipboard.writeText(target.href)
          }
        ];
      case 'IMG':
        return [
          {
            icon: Open,
            text: 'Open image in new tab',
            action: () => window.open(target.src, '_blank')
          },
          {
            icon: Open,
            text: 'Open image in new window',
            action: () =>
              window.open(target.src, '_blank', 'width=1200, height=800')
          },
          {},
          {
            icon: Save,
            text: 'Save image',
            action: () => window.open(`${target.src}&download`, '_blank')
          },
          {
            icon: Copy,
            text: 'Copy image address',
            action: () => navigator.clipboard.writeText(target.src)
          }
        ];
      case 'CODE':
        return [
          {
            icon: Copy,
            text: 'Copy code block',
            action: () => navigator.clipboard.writeText(target.innerText)
          }
        ];
      case 'BUTTON':
      default:
        return [
          {
            icon: ArrowLeft,
            text: 'Back',
            action: () => history.back()
          },
          {
            icon: ArrowRight,
            text: 'Forward',
            action: () => history.forward()
          },
          {
            icon: Reload,
            text: 'Reload',
            action: () => location.reload()
          },
          {},
          {
            icon: Cast,
            text: 'Cast',
            action: () => window.open('https://youtu.be/dQw4w9WgXcQ', '_blank')
          },
          {},
          {
            icon: Code,
            text: 'View page source',
            action: () =>
              window.open('https://github.com/kiosion/kio.dev', '_blank')
          }
        ];
    }
  })()) as MenuStateOpt[];

  const selection = window.getSelection()?.toString();
  if (selection && selection.trim() !== '') {
    opts.unshift({});
    opts.unshift({
      icon: Copy,
      text: 'Copy selection',
      action: () => navigator.clipboard.writeText(selection)
    });
  }

  const { left, top } = pageContainer
    ? pageContainer.getBoundingClientRect()
    : { left: 0, top: 0 };

  const res = {
    pos: { x: e.clientX - left, y: e.clientY - top },
    opts,
    target,
    open: true
  };

  if (get(state).open) {
    state.set({
      ...get(state),
      open: false
    });
    return setTimeout(() => {
      state.set(res);
    }, 200);
  } else {
    return state.set(res);
  }
};
