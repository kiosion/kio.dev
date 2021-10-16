<template>
  <div class="container text-light">
    <h1 class="text-3xl text-buffy font-bold">{{ msg }}</h1>
    <p>
      Quick demo site based on the Vue hello-world project. Working on new pages.
    </p>
    <br>
    <h3 class="text-xl font-bold">Temp Header</h3>
    <ul>
      <li><a href="#" target="_blank" rel="noopener">list item 1</a></li>
      <li><a href="#" target="_blank" rel="noopener">list item 2</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* TODO */
</style>
