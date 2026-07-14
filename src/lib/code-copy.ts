import { mount, unmount } from 'svelte';

import CodeCopyButton from '$components/code-copy-button.svelte';
import type { Action } from 'svelte/action';

/**
 * Adds a copy button to every `pre.shiki` inside the node.
 */
export const codeCopy: Action = (node) => {
  const buttons: object[] = [];

  for (const pre of node.querySelectorAll<HTMLPreElement>('pre.shiki')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.before(wrapper);
    wrapper.append(pre);

    buttons.push(
      mount(CodeCopyButton, {
        target: wrapper,
        props: {
          getText: () => pre.querySelector('code')?.innerText ?? pre.innerText,
        },
      }),
    );
  }

  return {
    destroy: () => {
      for (const button of buttons) {
        void unmount(button);
      }
    },
  };
};
