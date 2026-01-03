<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { Placement } from '@floating-ui/dom';
  import Tooltip from '$components/tooltips/tooltip.svelte';
  import { linkTo, t } from '$lib/i18n';

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
  content={(tooltipText ?? isMailLink)
    ? $t('Copy {value}', { value: `'${mailAddress}'` })
    : link && link.length > 50
      ? `${link.slice(0, 50 - 3)}...`
      : (link ?? $t('Visit'))}
  placement={tooltipPlacement}
  delay={[500, 0]}
>
  <svelte:element
    this={type}
    target={newtab ? '_blank' : undefined}
    rel={newtab ? 'noopener noreferrer' : undefined}
    class="focus-outline-sm hover:decoration-orange-light focus-visible:decoration-orange-light hover:dark:decoration-orange-light focus-visible:dark:decoration-orange-light cursor-pointer rounded-xs font-semibold underline decoration-neutral-200 decoration-2 underline-offset-[3px] transition-colors focus-visible:decoration-[3px] dark:decoration-neutral-400"
    tabindex="0"
    aria-label={$$props['aria-label']}
    {...$$restProps}
    href={link}
    onclick={() => {
      if (isMailLink) {
        navigator.clipboard.writeText(mailAddress);
      }

      dispatch('click');
    }}
    onkeyup={(e: KeyboardEvent) => {
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
