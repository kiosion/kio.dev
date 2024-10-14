<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { linkTo, t } from '$lib/i18n';

  import Tooltip from '$components/tooltips/tooltip.svelte';

  import type { Placement } from '@floating-ui/dom';

  export let tooltipPlacement: Placement = 'bottom',
    tooltipText: string | undefined = undefined,
    newtab = false;

  const isMailLink: boolean = $$props.href?.startsWith?.('mailto:'),
    mailAddress: string = isMailLink ? $$props.href.slice('mailto:'.length) : '',
    dispatch = createEventDispatcher(),
    type = !$$props.href?.length || isMailLink ? 'button' : 'a';

  $: link = (() => {
    if (isMailLink) {
      return undefined;
    }

    if ($$props.href?.startsWith('/')) {
      return $linkTo($$props.href);
    }

    return $$props.href;
  })();
</script>

<Tooltip
  content={tooltipText ?? isMailLink
    ? $t('Copy {value}', { value: `'${mailAddress}'` })
    : link && link.length > 50
      ? `${link.slice(0, 50 - 3)}...`
      : link ?? $t('Visit')}
  placement={tooltipPlacement}
>
  <svelte:element
    this={type}
    target={newtab ? '_blank' : undefined}
    rel={newtab ? 'noopener noreferrer' : undefined}
    class="focus-outline-sm rounded-xs font-semibold text-black underline decoration-neutral-200 decoration-2 underline-offset-[3px] transition-[text-decoration-color,color] hover:decoration-orange-light hover:decoration-[3px] focus-visible:decoration-orange-light focus-visible:decoration-[3px] dark:text-white dark:decoration-neutral-400 hover:dark:decoration-orange-light focus-visible:dark:decoration-orange-light"
    tabindex="0"
    aria-label={$$props['aria-label']}
    {...$$restProps}
    href={link}
    on:click={() => {
      if (isMailLink) {
        navigator.clipboard.writeText(mailAddress);
      }

      dispatch('click');
    }}
    on:keyup={(e) => {
      if (e.key !== 'Enter') {
        return;
      }

      if (isMailLink) {
        navigator.clipboard.writeText(mailAddress);
      }

      dispatch('click');
    }}
    role={type === 'a' ? 'link' : 'button'}
  >
    <slot />
  </svelte:element>
</Tooltip>
