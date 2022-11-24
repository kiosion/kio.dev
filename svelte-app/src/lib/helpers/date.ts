// import moment from 'moment';
import { t, currentLang } from '$i18n';
import { get } from 'svelte/store';

export const getAbsDate = (dateStr: string | undefined): string | undefined => {
  if (!dateStr) {
    return undefined;
  }
  try {
    return new Intl.DateTimeFormat(get(currentLang), {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateStr));
  } catch (_) {
    return t('Invalid date');
  }
};

export const getShortDate = (
  dateStr: string | undefined
): string | undefined => {
  if (!dateStr) {
    return undefined;
  }
  try {
    return new Intl.DateTimeFormat(get(currentLang), {
      year: 'numeric',
      month: 'long'
    }).format(new Date(dateStr));
  } catch (_) {
    return t('Invalid date');
  }
};

export const getRelDate = (dateStr: string | undefined): string => {
  if (!dateStr) {
    return t('Just now');
  }
  const date = new Date(dateStr);
  const formatter = new Intl.RelativeTimeFormat(get(currentLang), {
    numeric: 'auto'
  });

  const elapsed = Math.floor((new Date().getTime() - date.getTime()) / 1000),
    elapsedMin = Math.floor(elapsed / 60),
    elapsedH = Math.floor(elapsed / 3600),
    elapsedD = Math.floor(elapsed / 86400),
    elapsedMth = Math.floor(elapsed / (3600 * 24 * 30)),
    elapsedY = Math.floor(elapsed / (3600 * 24 * 365));

  if (elapsedY > 0) {
    return `${formatter.format(-elapsedY, 'year')}`;
  } else if (elapsedMth > 0) {
    return `${formatter.format(-elapsedMth, 'month')}`;
  } else if (elapsedD > 0) {
    return `${formatter.format(-elapsedD, 'day')}`;
  } else if (elapsedH > 0) {
    return `${formatter.format(-elapsedH, 'hour')}`;
  } else if (elapsedMin > 0) {
    return `${formatter.format(-elapsedMin, 'minute')}`;
  } else {
    return `${formatter.format(-elapsed, 'second')}`;
  }
};

export const getReadingTime = (text: string | string[]): number => {
  if (!text) {
    return 0;
  } else if (typeof text !== 'string') {
    text = text.join(' ');
  }

  const words = text.split(/\s+/).filter((word) => word.length > 0).length;

  return Math.ceil(words / (100 / 60));
};
