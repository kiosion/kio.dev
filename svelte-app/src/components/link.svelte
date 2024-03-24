<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { linkTo, t } from '$lib/i18n';

  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  const dispatch = createEventDispatcher(),
    type = $$props.href ? 'a' : 'button';

  export let tooltipDelay = 300,
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
    delay={tooltipDelay}
    text={tooltipText ??
      (link && link.length > 50 ? `${link.slice(0, 50 - 3)}...` : link ?? $t('Visit'))}
  >
    <svelte:element
      this={type}
      class="focus-outline-sm rounded-sm from-accent-light underline decoration-accent-light underline-offset-[2px] dark:decoration-accent-dark {hovered
        ? 'decoration-[3px]'
        : 'decoration-2'} transition-[text-decoration-color]"
      aria-label={$$props['aria-label']}
      rel={newtab ? 'noopener noreferrer' : undefined}
      tabindex="0"
      target={newtab ? '_blank' : undefined}
      {...$$restProps}
      href={link}
      role={type === 'a' ? 'link' : 'button'}
      on:click={() => dispatch('click')}
      on:keyup={(e) => e.key === 'Enter' && dispatch('click')}
    >
      <slot />
    </svelte:element>
  </Tooltip>
</Hoverable>
