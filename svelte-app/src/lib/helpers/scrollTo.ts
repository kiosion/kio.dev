import type { Page as PageStore } from '@sveltejs/kit';

const attemptScroll = (page: PageStore, scrollParams = {}) => {
  const { url } = page,
    { hash } = url;

  if (hash && hash.length > 1) {
    const target =
      document.getElementById(hash.slice(1)) ||
      document.getElementById(`heading-${hash.slice(1)}`);
    if (target) {
      // console.log('target offset:', target.offsetTop);
      // window.scrollTo({
      //   top: Math.min(0, target.offsetTop - 80),
      //   behavior: 'smooth',
      //   ...scrollParams
      // });
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        ...scrollParams
      });
    }
  }
};

export default attemptScroll;
