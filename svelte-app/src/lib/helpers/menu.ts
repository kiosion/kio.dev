import { get } from 'svelte/store';
import { state } from '$stores/menu';
import { t, isLocalized } from '$i18n';
import { page } from '$app/stores';
import { APP_LANGS } from '$lib/consts';
import type { MenuStateOpt } from '$types';

const appLangsRegex = `(${APP_LANGS.map((lang) => lang.toLowerCase()).join(
  '|'
)}|${APP_LANGS.map((lang) => lang.toUpperCase()).join('|')})`;

const findSourceFile = (path: string) => {
  if (get(isLocalized)) {
    path = path.replace(new RegExp(`^/${appLangsRegex}`), '/');
  }

  const gitHubBase = 'https://github.com/kiosion/kio.dev/blob/main/svelte-app/',
    baseDir = gitHubBase + 'src/routes/[[lang=lang]]/',
    srcDirs = new Map<RegExp, string>([
      [/^\/$/, '+page.svelte'],
      [/^\/blog\/?$/, 'blog/+page.svelte'],
      [/^\/blog\/([^/]+)\/?$/, 'blog/[slug]/+page@.svelte'],
      [/^\/work\/?$/, 'work/+page.svelte'],
      [/^\/work\/([^/]+)\/?$/, 'work/[slug]/+page@.svelte'],
      [/^\/etc\/?$/, 'etc/+page.svelte']
    ]);

  for (const [re, dir] of srcDirs) {
    if (re.test(path)) {
      return baseDir + dir;
    }
  }

  return gitHubBase;
};

export const setState = (e?: MouseEvent, pageContainer?: HTMLElement) => {
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
  const opts = (() => {
    switch (target?.tagName.toUpperCase()) {
      case 'A':
        if ((target as HTMLAnchorElement).href.indexOf('mailto:') >= 0) {
          return [
            {
              icon: 'MailArrowRight',
              text: `${get(t)('Mail')} ${
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
            icon: 'Open',
            text: get(t)('Open link in new tab'),
            action: () =>
              window.open((target as HTMLAnchorElement).href, '_blank')
          },
          {
            icon: 'Open',
            text: get(t)('Open link in new window'),
            action: () =>
              window.open(
                (target as HTMLAnchorElement).href,
                '_blank',
                'width=1200, height=800'
              )
          },
          {},
          {
            icon: 'Link',
            text: `${get(t)('Go to')} '${(target as HTMLAnchorElement).href}'`,
            action: () =>
              window.open((target as HTMLAnchorElement).href, '_self')
          },
          {},
          {
            icon: 'Copy',
            text: get(t)('Copy link address'),
            action: () =>
              navigator.clipboard.writeText((target as HTMLAnchorElement).href)
          }
        ];
      case 'IMG':
        return [
          {
            icon: 'Open',
            text: get(t)('Open image in new tab'),
            action: () =>
              window.open((target as HTMLImageElement).src, '_blank')
          },
          {
            icon: 'Open',
            text: get(t)('Open image in new window'),
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
            text: get(t)('Save image'),
            action: () =>
              window.open(
                `${(target as HTMLImageElement).src}&download`,
                '_blank'
              )
          },
          {
            icon: 'Copy',
            text: get(t)('Copy image address'),
            action: () =>
              navigator.clipboard.writeText((target as HTMLImageElement).src)
          }
        ];
      case 'CODE':
        return [
          {
            icon: 'Copy',
            text: get(t)('Copy code block'),
            action: () => navigator.clipboard.writeText(target.innerText)
          }
        ];
      case 'BUTTON':
      default:
        return [
          {
            icon: 'ArrowLeft',
            text: get(t)('Back'),
            action: () => history.back()
          },
          {
            icon: 'ArrowRight',
            text: get(t)('Forward'),
            action: () => history.forward()
          },
          {
            icon: 'Reload',
            text: get(t)('Reload'),
            action: () => location.reload()
          },
          {},
          {
            icon: 'Cast',
            text: get(t)('Cast'),
            action: () => window.open('https://youtu.be/dQw4w9WgXcQ', '_blank')
          },
          {},
          {
            icon: 'Code',
            text: get(t)('View page source'),
            action: () =>
              window.open(findSourceFile(get(page).url.pathname), '_blank')
          }
        ];
    }
  })() as MenuStateOpt[];

  const selection = window.getSelection()?.toString();
  if (selection && selection.trim() !== '') {
    opts.unshift({});
    opts.unshift({
      icon: 'Copy',
      text: get(t)('Copy selection'),
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
  }

  return state.set(res);
};
