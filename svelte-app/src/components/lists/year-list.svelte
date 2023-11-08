<script lang="ts">
  import { sortDocumentsByYear } from '$helpers/date';

  import ListItem from '$components/lists/list-item.svelte';

  import type { PostDocument, ProjectDocument } from '$types';

  export let documents: (ProjectDocument | PostDocument)[];

  const sortedDocuments = sortDocumentsByYear(documents);
</script>

<div class="year-list-wrapper">
  {#each sortedDocuments as object}
    <section>
      <h1>{object.year}</h1>
      <div>
        {#each object.items as item}
          <ListItem document={item} />
        {/each}
      </div>
    </section>
  {/each}
</div>

<style lang="scss">
  @import '@styles/mixins';

  .year-list-wrapper {
    @apply mt-8 flex flex-col gap-10;
  }

  section {
    @apply flex flex-col items-start justify-start gap-3;

    h1 {
      @apply min-w-[5rem] font-code text-3xl font-black transition-colors;
    }

    div {
      @apply ml-1 mt-1 flex flex-col items-start justify-start gap-6;

      @include media(md) {
        @apply ml-0;
      }
    }

    @include media(md) {
      @apply flex-row;
    }
  }
</style>
