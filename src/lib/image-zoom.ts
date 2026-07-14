import mediumZoom from 'medium-zoom';
import type { Action } from 'svelte/action';

/**
 * Click-to-zoom for content images.
 */
export const imageZoom: Action = (node) => {
  const images = [...node.querySelectorAll<HTMLImageElement>('img')].filter(
    (img) => !img.closest('a'),
  );
  if (!images.length) {
    return;
  }

  const zoom = mediumZoom(images, {
    margin: 20,
    background: 'var(--zoom-overlay-bg)',
  });

  return {
    destroy: () => {
      zoom.detach();
    },
  };
};
