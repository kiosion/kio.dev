<script lang="ts">
  import PageHeading from '@/components/headings/page-heading.svelte';
  import { navOptions, pageHeading } from '@/stores/menu';

  navOptions.set({ down: '', up: '/blog' });
  pageHeading.set('Blog | All posts');
</script>

<div>
  <PageHeading heading="Empty for now..." />
</div>
