<template>
  <div>
    <NavBar/>
    <Page/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NavBar from './components/nav/NavBar.vue';
import Page from './components/body/Page.vue'

@Options({
  components: {
    NavBar, Page
  },
})
export default class App extends Vue {}
</script>
