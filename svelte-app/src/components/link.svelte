<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { linkTo } from '$i18n';

  import Hoverable from '$components/hoverable.svelte';
  import Tooltip from '$components/tooltip.svelte';

  let hovered: boolean;

  const dispatch = createEventDispatcher(),
    type = $$props.href ? 'a' : 'button';

  $: link = $$props.href
    ? $$props.href.startsWith('/')
      ? $linkTo($$props.href)
      : $$props.href
    : undefined;
</script>

<Hoverable bind:hovered>
  <Tooltip text={link?.length > 50 ? `${link.slice(0, 50)}...` : link} delay={750} fixed>
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
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          dispatch('click');
        }
      }}
      role={type === 'a' ? 'link' : 'button'}
      aria-label={$$props['aria-label']}
      {...$$restProps}
    >
      <slot />
    </svelte:element>
  </Tooltip>
</Hoverable>
