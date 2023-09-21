<script lang="ts">
  import { linkTo, t } from '$i18n';

  import Divider from '$components/divider.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let data: PostDocument | ProjectDocument,
    model: 'post' | 'project' = data._type;
</script>

<div class="mt-4">
  <Divider />
  <a
    href={$linkTo(model === 'post' ? '/blog' : '/work')}
    class="focusOutline inline-block w-full rounded-sm pl-[8px] text-right font-code text-accent-light hover:text-dark dark:text-accent-dark dark:hover:text-light"
    aria-label={$t('See more')}
    data-sveltekit-preload-code
    data-sveltekit-preload-data
  >
    &larr; Read more
  </a>
</div>
