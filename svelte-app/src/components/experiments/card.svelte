<script lang="ts">
  export let title: string, description: string;
</script>

<section>
  <div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>

  <slot />
</section>

<style lang="scss"></style>
