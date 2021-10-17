<template>
  <div>
    <NavBar/>
    <Page/>
  </div>
</template>

<script>
import NavBar from './components/nav/NavBar.vue'
import Page from './components/body/Page.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    Page,
  }
}
</script>

<style src="./assets/tailwind.css"/>
