<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { linkTo, t } from '$lib/i18n';

  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  const dispatch = createEventDispatcher(),
    type = $$props.href ? 'a' : 'button';

  $: link = $$props.href
    ? $$props.href.startsWith('/')
      ? $linkTo($$props.href)
      : $$props.href
    : undefined;
</script>

<Hoverable let:hovered>
  <Tooltip
    text={link && link.length > 50 ? `${link.slice(0, 50 - 3)}...` : link ?? $t('Visit')}
    delay={300}
  >
    <svelte:element
      this={type}
      target={$$props.newtab ? '_blank' : undefined}
      rel={$$props.newtab ? 'noopener noreferrer' : undefined}
      class="focus-outline-sm rounded-sm from-accent-light underline decoration-accent-light underline-offset-[2px] dark:decoration-accent-dark {hovered
        ? 'decoration-[3px]'
        : 'decoration-2'} transition-[text-decoration-color]"
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
