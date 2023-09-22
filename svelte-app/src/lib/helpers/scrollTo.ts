import type { Page as PageStore } from '@sveltejs/kit';

export default (url: PageStore['url'], scrollParams: ScrollIntoViewOptions = {}) => {
  const { hash } = url || { hash: '' };

  if (!hash.length) {
    return;
  }

  const target =
    document.getElementById(hash.slice(1)) ||
    document.getElementById(`heading-${hash.slice(1)}`);

  target?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    ...scrollParams
  });
};
