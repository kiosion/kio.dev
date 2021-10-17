<template>
  <!-- <div class="container text-light mt-4 sm:mt-8"> -->
  <div class="container flex flex-1 flex-col mt-4 sm:mt-8">
    <Body 
      header1="placeholder" 
      label1="title"
      content1="Quick demo site based on the Vue hello-world project. Currently working on new pages and components :)"
      header2="header2"
      label2="header 2"
      content2="Lorum ipsum doler sit amet."
    />
    <!-- <span class="block text-left">Quick demo site based on the Vue hello-world project. Currently working on new pages and components :)</span>
    <br>
    <h3 class="text-xl font-bold">Temp Header</h3>
    <ul>
      <li><a href="#" target="_blank" rel="noopener">list item 1</a></li>
      <li><a href="#" target="_blank" rel="noopener">list item 2</a></li>
    </ul> -->
  </div>
</template>

<script>
import Body from './Body.vue'

export default {
  name: 'Page',
  props: {},
  components: {
    Body,
  }
}
</script>
