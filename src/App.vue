<template>
  <NavBar/>
  <Page/>
  <Footer/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import NavBar from './components/nav/NavBar.vue'
import Page from './components/body/Page.vue'
import Footer from './components/nav/Footer.vue'

@Options({
  components: {
    NavBar,
    Page,
    Footer,
  },
})
export default class App extends Vue {}
</script>
