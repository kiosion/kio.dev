<script lang="ts">
  import { t } from '$i18n';

  import Divider from '$components/divider.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import Hoverable from '$components/hoverable.svelte';
  import Tags from '$components/tags.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let model: 'post' | 'project', data: PostDocument | ProjectDocument;

  $: extLinks =
    model === 'project' &&
    ((data as ProjectDocument).externalLinks as ProjectDocument['externalLinks'] &
      {
        hovered: boolean;
      }[]);
</script>

<div class="mt-4" data-test-id="{model}-footer">
  <Divider />
  {#if data.tags && data.tags.length > 0}
    <IconHeader icon="CardText" text={$t('Tags')} class="mb-4 mt-8 h-fit w-full" />
    <Tags {model} data={data.tags} size="lg" />
  {/if}
  {#if extLinks && extLinks.length > 0}
    <Divider />
    <IconHeader icon="link" text={$t('Links')} class="mb-4 mt-8 h-fit w-full" />
    <ul class="ml-8 list-disc">
      {#each extLinks as link}
        <li>
          <Hoverable bind:hovered={link.hovered}>
            <a
              href={link.url}
              target={'_blank'}
              rel={'noopener noreferrer'}
              class="underlined from-accent-light dark:from-accent-dark {link.hovered
                ? 'active dark:text-gray-800'
                : ''} focusOutline-sm -mx[2px] rounded-sm px-[2px]"
              tabindex="0"
            >
              {link.title}
            </a>
          </Hoverable>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="scss">
  .underlined {
    text-decoration: none;
    background-image: linear-gradient(
      to right,
      var(--tw-gradient-from) 0%,
      var(--tw-gradient-from) 100%
    );
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: calc(100% - 4px) 2px;
    transition: background-size 50ms ease, color 50ms ease;
    &.active {
      background-size: calc(100% - 4px) 100%;
    }
  }
</style>
