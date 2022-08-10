export const getAbsDate = (dateStr: string | undefined) => {
  if (!dateStr) {
    return '...';
  }
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  return `${formatter.format(date)}`;
};

export const getRelDate = (dateStr: string | undefined) => {
  if (!dateStr) {
    return '...';
  }
  const date = new Date(dateStr);
  const formatter = new Intl.RelativeTimeFormat('default', {
    numeric: 'auto'
  });

  const elapsed = Math.floor((new Date().getTime() - date.getTime()) / 1000),
    elapsedMin = Math.floor(elapsed / 60),
    elapsedH = Math.floor(elapsed / 3600),
    elapsedMth = Math.floor(elapsed / (3600 * 24 * 30)),
    elapsedY = Math.floor(elapsed / (3600 * 24 * 365));

  if (elapsedY > 0) {
    return `${formatter.format(-elapsedY, 'year')}`;
  } else if (elapsedMth > 0) {
    return `${formatter.format(-elapsedMth, 'month')}`;
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
