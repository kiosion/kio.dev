<script lang="ts">
  import Divider from '$components/divider.svelte';
  import IconHeader from '$components/headings/icon-header.svelte';
  import type { PostDocument, ProjectDocument } from '$types';
  import { t } from '$i18n';
  import Tags from '$components/tags.svelte';

  export let model: 'post' | 'project';
  export let data: PostDocument | ProjectDocument;
</script>

<div class="mt-4" data-test-id="{model}-footer">
  <Divider />
  {#if data.tags}
    <IconHeader
      icon="CardText"
      text={t('Tags')}
      classes="mt-8 mb-4 w-full h-fit"
    />
    <Tags {model} data={data.tags} size="lg" />
  {/if}
</div>
