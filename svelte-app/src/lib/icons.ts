import Logger from '$lib/logger';

import Alert from 'pixelarticons/svg/alert.svg';
import ArrowBarUp from 'pixelarticons/svg/arrow-bar-up.svg';
import ArrowLeft from 'pixelarticons/svg/arrow-left.svg';
import ArrowRight from 'pixelarticons/svg/arrow-right.svg';
import Cast from 'pixelarticons/svg/cast.svg';
import ChevronDown from 'pixelarticons/svg/chevron-down.svg';
import CloseBox from 'pixelarticons/svg/close-box.svg';
import Code from 'pixelarticons/svg/code.svg';
import Copy from 'pixelarticons/svg/copy.svg';
import Downasaur from 'pixelarticons/svg/downasaur.svg';
import Link from 'pixelarticons/svg/link.svg';
import MailArrowRight from 'pixelarticons/svg/mail-arrow-right.svg';
import Menu from 'pixelarticons/svg/menu.svg';
import MoonStars from 'pixelarticons/svg/moon-stars.svg';
import Open from 'pixelarticons/svg/open.svg';
import Reload from 'pixelarticons/svg/reload.svg';
import Save from 'pixelarticons/svg/save.svg';
import Script from 'pixelarticons/svg/script.svg';
import Sun from 'pixelarticons/svg/sun.svg';

import type { PixelIcon } from '$types';

const icons = {
  alert: Alert,
  'arrow-bar-up': ArrowBarUp,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  cast: Cast,
  'chevron-down': ChevronDown,
  'close-box': CloseBox,
  code: Code,
  copy: Copy,
  downasaur: Downasaur,
  link: Link,
  'mail-arrow-right': MailArrowRight,
  menu: Menu,
  'moon-stars': MoonStars,
  open: Open,
  reload: Reload,
  save: Save,
  script: Script,
  sun: Sun
};

type IconName = keyof typeof icons;

const transformName = (name: string): IconName => {
  return name
    .replace(/([a-z])([A-Z])|([A-Z])([A-Z](?=[a-z]))|([a-zA-Z])(\d)/g, '$1$3$5-$2$4$6')
    .toLowerCase() as IconName;
};

const getIcon = (iconName: string) => {
  const name = transformName(iconName);
  if (!icons[name]) {
    Logger.error(`Icon ${name} not found`);
    return icons.alert as PixelIcon;
  }
  return icons[name] as PixelIcon;
};

export default { get: getIcon };
