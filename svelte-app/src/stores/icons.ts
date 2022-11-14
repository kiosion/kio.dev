import { get, writable } from 'svelte/store';
import type { PixelIcon } from '$lib/types';

// Some default imports that are immediately used
import Alert from 'pixelarticons/svg/alert.svg';
import Sun from 'pixelarticons/svg/sun.svg';
import MoonStars from 'pixelarticons/svg/moon-stars.svg';

const icons = writable(
  new Map() as Map<string, PixelIcon | (() => Promise<PixelIcon>)>
);

const icon = async (query: string): Promise<PixelIcon> => {
  let iconValue: (() => Promise<PixelIcon>) | undefined =
    get(icons)?.get(query);
  if (!iconValue) {
    iconValue = get(icons).get('Alert');
  }
  return (
    iconValue &&
    (await iconValue().then((res: PixelIcon) => {
      get(icons).set(query, () => Promise.resolve(res));
      return res;
    }))
  );
};

export { icon };

get(icons)
  .set('Alert', async () => Promise.resolve(Alert))
  .set('Sun', async () => Promise.resolve(Sun))
  .set('MoonStars', async () => Promise.resolve(MoonStars))
  .set(
    'AbTesting',
    async () =>
      await import('pixelarticons/svg/ab-testing.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'ArrowUp',
    async () =>
      await import('pixelarticons/svg/arrow-up.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'ArrowDown',
    async () =>
      await import('pixelarticons/svg/arrow-down.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'ArrowLeft',
    async () =>
      await import('pixelarticons/svg/arrow-left.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'ArrowRight',
    async () =>
      await import('pixelarticons/svg/arrow-right.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'ArticleMultiple',
    async () =>
      await import('pixelarticons/svg/article-multiple.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'ArtText',
    async () =>
      await import('pixelarticons/svg/art-text.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'Book',
    async () =>
      await import('pixelarticons/svg/book.svg').then((Icon) => Icon.default)
  )
  .set(
    'BookOpen',
    async () =>
      await import('pixelarticons/svg/book-open.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'Briefcase',
    async () =>
      await import('pixelarticons/svg/briefcase.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'BulletList',
    async () =>
      await import('pixelarticons/svg/bulletlist.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'CardText',
    async () =>
      await import('pixelarticons/svg/card-text.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'Cast',
    async () =>
      await import('pixelarticons/svg/cast.svg').then((Icon) => Icon.default)
  )
  .set(
    'Circle',
    async () =>
      await import('pixelarticons/svg/circle.svg').then((Icon) => Icon.default)
  )
  .set(
    'Clock',
    async () =>
      await import('pixelarticons/svg/clock.svg').then((Icon) => Icon.default)
  )
  .set(
    'Check',
    async () =>
      await import('pixelarticons/svg/check.svg').then((Icon) => Icon.default)
  )
  .set(
    'ChevronDown',
    async () =>
      await import('pixelarticons/svg/chevron-down.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'CloseBox',
    async () =>
      await import('pixelarticons/svg/close-box.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'Code',
    async () =>
      await import('pixelarticons/svg/code.svg').then((Icon) => Icon.default)
  )
  .set(
    'Copy',
    async () =>
      await import('pixelarticons/svg/copy.svg').then((Icon) => Icon.default)
  )
  .set(
    'CornerDownRight',
    async () =>
      await import('pixelarticons/svg/corner-down-right.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'Downasaur',
    async () =>
      await import('pixelarticons/svg/downasaur.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'Git-Branch',
    async () =>
      await import('pixelarticons/svg/git-branch.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'InfoBox',
    async () =>
      await import('pixelarticons/svg/info-box.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'Invert',
    async () =>
      await import('pixelarticons/svg/invert.svg').then((Icon) => Icon.default)
  )
  .set(
    'Link',
    async () =>
      await import('pixelarticons/svg/link.svg').then((Icon) => Icon.default)
  )
  .set(
    'List',
    async () =>
      await import('pixelarticons/svg/list.svg').then((Icon) => Icon.default)
  )
  .set(
    'Loader',
    async () =>
      await import('pixelarticons/svg/loader.svg').then((Icon) => Icon.default)
  )
  .set(
    'MailArrowRight',
    async () =>
      await import('pixelarticons/svg/mail-arrow-right.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'Menu',
    async () =>
      await import('pixelarticons/svg/menu.svg').then((Icon) => Icon.default)
  )
  .set(
    'Open',
    async () =>
      await import('pixelarticons/svg/open.svg').then((Icon) => Icon.default)
  )
  .set(
    'Pin',
    async () =>
      await import('pixelarticons/svg/pin.svg').then((Icon) => Icon.default)
  )
  .set(
    'Reload',
    async () =>
      await import('pixelarticons/svg/reload.svg').then((Icon) => Icon.default)
  )
  .set(
    'Save',
    async () =>
      await import('pixelarticons/svg/save.svg').then((Icon) => Icon.default)
  )
  .set(
    'Volume2',
    async () =>
      await import('pixelarticons/svg/volume-2.svg').then(
        (Icon) => Icon.default
      )
  )
  .set(
    'VolumeX',
    async () =>
      await import('pixelarticons/svg/volume-x.svg').then(
        (Icon) => Icon.default
      )
  );
