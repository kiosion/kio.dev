<script lang="ts">
  import type { Placement } from '@floating-ui/dom';
  import Tooltip from '$components/tooltips/tooltip.svelte';
  import { linkTo, t } from '$lib/i18n';
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  type CommonProps = {
    children: Snippet;
    tooltipPlacement?: Placement;
    tooltipText?: string;
    showTooltip?: boolean;
    size?: 'sm' | 'md' | 'lg';
    'data-sveltekit-preload-code'?: 'eager' | 'hover' | 'off' | 'tap' | 'viewport';
    'data-sveltekit-preload-data'?: 'hover' | 'off' | 'tap';
    onclick?: (e: MouseEvent | KeyboardEvent) => void;
  };

  type AnchorProps = CommonProps & { href: string; target?: string; rel?: string } & Omit<
      HTMLAnchorAttributes,
      'href' | 'onclick'
    >;
  type ButtonProps = CommonProps & {
    href?: undefined;
    target?: undefined;
    rel?: undefined;
  } & HTMLButtonAttributes;

  type Props = AnchorProps | ButtonProps;

  let {
    children,
    tooltipPlacement = 'bottom',
    tooltipText = undefined,
    showTooltip = false,
    size = 'md',
    onclick,
    ...restProps
  }: Props = $props();

  const isMailLink = $derived(restProps.href?.startsWith('mailto:')),
    mailAddress = $derived(
      isMailLink ? (restProps.href?.slice('mailto:'.length) ?? '') : '',
    ),
    type = $derived(!restProps.href?.length || isMailLink ? 'button' : 'a'),
    link = $derived.by(() => {
      if (isMailLink || !restProps.href?.length) {
        return undefined;
      }
      return restProps.href.startsWith('/') ? $linkTo(restProps.href) : restProps.href;
    });
</script>

<Tooltip
  content={showTooltip
    ? isMailLink
      ? $t('Copy {value}', { value: `'${mailAddress}'` })
      : tooltipText?.trim().length
        ? tooltipText
        : link && link.length > 50
          ? `${link.slice(0, 50 - 3)}...`
          : (link ?? $t('Visit'))
    : undefined}
  placement={tooltipPlacement}
  delay={[500, 0]}>
  <svelte:element
    this={type}
    rel={restProps.target ?? undefined}
    tabindex="0"
    {...restProps}
    class="hover:decoration-orange-light focus-visible:decoration-orange-light hover:dark:decoration-orange-light focus-visible:dark:decoration-orange-light cursor-pointer rounded-xs underline decoration-neutral-200 decoration-2 underline-offset-[3px] opacity-100 transition-[color,text-decoration-color,opacity] hover:opacity-80 focus-visible:opacity-80 dark:decoration-neutral-400 {restProps.class ||
      ''}"
    class:text-base={size === 'sm'}
    class:text-lg={size === 'lg'}
    href={link}
    onclick={(e: MouseEvent) => {
      if (isMailLink) {
        navigator.clipboard.writeText(mailAddress);
      }
      onclick?.(e);
    }}
    onkeyup={(e: KeyboardEvent) => {
      if (e.key !== 'Enter') {
        return;
      }
      if (isMailLink) {
        navigator.clipboard.writeText(mailAddress);
      }
      onclick?.(e);
    }}
    role={type === 'a' ? 'link' : 'button'}>
    {@render children()}
  </svelte:element>
</Tooltip>
