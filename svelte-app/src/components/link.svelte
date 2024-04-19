<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { linkTo, t } from '$lib/i18n';

  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  const dispatch = createEventDispatcher(),
    type = $$props.href ? 'a' : 'button';

  export let tooltipDelay = 300,
    tooltipPosition: 'top' | 'bottom' = 'bottom',
    tooltipText: string | undefined = undefined,
    newtab = false;

  $: link = $$props.href
    ? $$props.href.startsWith('/')
      ? $linkTo($$props.href)
      : $$props.href
    : undefined;
</script>

<Hoverable let:hovered>
  <Tooltip
    text={tooltipText ??
      (link && link.length > 50 ? `${link.slice(0, 50 - 3)}...` : link ?? $t('Visit'))}
    position={tooltipPosition}
    delay={tooltipDelay}
  >
    <svelte:element
      this={type}
      target={newtab ? '_blank' : undefined}
      rel={newtab ? 'noopener noreferrer' : undefined}
      class="focus-outline-sm rounded-sm from-accent-light underline decoration-accent-light underline-offset-[2px] transition-[text-decoration-color] dark:decoration-accent-dark"
      class:decoration-[3px]={hovered}
      class:decoration-2={!hovered}
      tabindex="0"
      aria-label={$$props['aria-label']}
      {...$$restProps}
      href={link}
      on:click={() => dispatch('click')}
      on:keyup={(e) => e.key === 'Enter' && dispatch('click')}
      role={type === 'a' ? 'link' : 'button'}
    >
      <slot />
    </svelte:element>
  </Tooltip>
</Hoverable>
