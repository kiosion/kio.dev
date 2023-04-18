import type { Page as PageStore } from '@sveltejs/kit';
import type LocomotiveScroll from 'locomotive-scroll';

export const attemptScroll = (page: PageStore, scrollParams = {}) => {
  const { url } = page,
    { hash } = url;

  if (hash && hash.length > 1) {
    const target =
      document.getElementById(hash.slice(1)) ||
      document.getElementById(`heading-${hash.slice(1)}`);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        ...scrollParams
      });
    }
  }
};

export const attemptLocomotiveScroll = (
  page: PageStore,
  locomotiveInstance: LocomotiveScroll,
  scrollParams = {}
) => {
  const { url } = page,
    { hash } = url;

  if (!(hash?.length > 1)) {
    return;
  }

  const target =
    document.getElementById(hash.slice(1)) ||
    document.getElementById(`heading-${hash.slice(1)}`);

  if (!target) {
    return;
  }

  locomotiveInstance.scrollTo(target, {
    duration: 1000,
    offset: -100,
    ...scrollParams
  });
};

export default attemptScroll;
