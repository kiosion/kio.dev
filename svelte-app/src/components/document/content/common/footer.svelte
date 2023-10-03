<script lang="ts">
  import { linkTo, t } from '$i18n';

  import ArrowButton from '$components/controls/arrow-button.svelte';
  import Divider from '$components/divider.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let data: PostDocument | ProjectDocument,
    model: 'post' | 'project' = data._type;
</script>

<div class="mt-4">
  <Divider />
  <ArrowButton
    class="w-full text-left"
    href={model === 'post' ? $linkTo('/blog') : $linkTo('/work')}
    preload
  >
    &larr; {$t('Read more')}
  </ArrowButton>
</div>
