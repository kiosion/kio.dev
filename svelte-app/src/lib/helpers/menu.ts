import { get } from 'svelte/store';
import { state } from '$stores/menu';
import type { MenuStateOpt } from '$lib/types';

export const setState = async (e?: MouseEvent, pageContainer?: HTMLElement) => {
  if (!e) {
    return state.set({
      ...get(state),
      open: false
    });
  }

  let target = e.target as HTMLElement;
  target = target?.closest('code') || target;
  target = (target?.closest('button') as HTMLButtonElement) || target;
  target = (target?.closest('a') as HTMLAnchorElement) || target;

  // eslint-disable-next-line @typescript-eslint/require-await
  const opts = (await (async () => {
    switch (target?.tagName.toUpperCase()) {
      case 'A':
        if ((target as HTMLAnchorElement).href.indexOf('mailto:') >= 0) {
          return [
            {
              icon: 'MailArrowRight',
              text: `Mail ${
                (target as HTMLAnchorElement).href.split(':')?.[1]
              }`,
              action: () =>
                window.open((target as HTMLAnchorElement).href, '_self')
            },
            {},
            {
              icon: 'Copy',
              text: 'Copy email address',
              action: () =>
                navigator.clipboard.writeText(
                  (target as HTMLAnchorElement).href
                )
            }
          ];
        }
        return [
          {
            icon: 'Link',
            text: `Go to '${(target as HTMLAnchorElement).href}'`,
            action: () =>
              window.open((target as HTMLAnchorElement).href, '_self')
          },
          {},
          {
            icon: 'Open',
            text: 'Open link in new tab',
            action: () =>
              window.open((target as HTMLAnchorElement).href, '_blank')
          },
          {
            icon: 'Open',
            text: 'Open link in new window',
            action: () =>
              window.open(
                (target as HTMLAnchorElement).href,
                '_blank',
                'width=1200, height=800'
              )
          },
          {},
          {
            icon: 'Copy',
            text: 'Copy link address',
            action: () =>
              navigator.clipboard.writeText((target as HTMLAnchorElement).href)
          }
        ];
      case 'IMG':
        return [
          {
            icon: 'Open',
            text: 'Open image in new tab',
            action: () =>
              window.open((target as HTMLImageElement).src, '_blank')
          },
          {
            icon: 'Open',
            text: 'Open image in new window',
            action: () =>
              window.open(
                (target as HTMLImageElement).src,
                '_blank',
                'width=1200, height=800'
              )
          },
          {},
          {
            icon: 'Save',
            text: 'Save image',
            action: () =>
              window.open(
                `${(target as HTMLImageElement).src}&download`,
                '_blank'
              )
          },
          {
            icon: 'Copy',
            text: 'Copy image address',
            action: () =>
              navigator.clipboard.writeText((target as HTMLImageElement).src)
          }
        ];
      case 'CODE':
        return [
          {
            icon: 'Copy',
            text: 'Copy code block',
            action: () => navigator.clipboard.writeText(target.innerText)
          }
        ];
      case 'BUTTON':
      default:
        return [
          {
            icon: 'ArrowLeft',
            text: 'Back',
            action: () => history.back()
          },
          {
            icon: 'ArrowRight',
            text: 'Forward',
            action: () => history.forward()
          },
          {
            icon: 'Reload',
            text: 'Reload',
            action: () => location.reload()
          },
          {},
          {
            icon: 'Cast',
            text: 'Cast',
            action: () => window.open('https://youtu.be/dQw4w9WgXcQ', '_blank')
          },
          {},
          {
            icon: 'Code',
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
      icon: 'Copy',
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
