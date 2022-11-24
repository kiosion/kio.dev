import Alert from 'pixelarticons/svg/alert.svg';
import Sun from 'pixelarticons/svg/sun.svg';
import MoonStars from 'pixelarticons/svg/moon-stars.svg';
import Logger from '$lib/logger';
import type { PixelIcon } from '$lib/types';

const transformName = (name: string) => {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .toLowerCase();
};

const iconProxy = new Proxy(
  new Map<string, PixelIcon>([
    ['alert', Alert],
    ['sun', Sun],
    ['moon-stars', MoonStars]
  ]),
  {
    get: (target, prop) => {
      switch (prop) {
        case 'get': {
          return async (iconName: string) => {
            iconName = transformName(iconName);
            if (!target.has(iconName)) {
              const icon = await import(
                `../../node_modules/pixelarticons/svg/${iconName}.svg`
              )
                .then((res) => {
                  if (!res) {
                    Logger.error(`Icon ${iconName} not found`);
                    return target.get('alert');
                  }
                  target.set(iconName, res.default);
                  return res.default;
                })
                .catch(() => target.get('alert'));
              return icon;
            }
            return target.get(iconName);
          };
        }
        default: {
          return undefined;
        }
      }
    }
  }
);

export default iconProxy;
