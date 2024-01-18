<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { linkTo, t } from '$i18n';

  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltip.svelte';

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
    text={link?.length > 50 ? `${link.slice(0, 50)}...` : link ?? $t('Visit')}
    delay={500}
    fixed
  >
    <svelte:element
      this={type}
      href={link}
      target={$$props.newtab ? '_blank' : undefined}
      rel={$$props.newtab ? 'noopener noreferrer' : undefined}
      class="focusOutline-sm rounded-sm from-accent-light underline decoration-accent-light underline-offset-[2px] dark:decoration-accent-dark {hovered
        ? 'decoration-[3px]'
        : 'decoration-2'} transition-[text-decoration-color]"
      tabindex="0"
      on:click={() => dispatch('click')}
      on:keyup={(e) => e.key === 'Enter' && dispatch('click')}
      role={type === 'a' ? 'link' : 'button'}
      aria-label={$$props['aria-label']}
      {...$$restProps}
    >
      <slot />
    </svelte:element>
  </Tooltip>
</Hoverable>
