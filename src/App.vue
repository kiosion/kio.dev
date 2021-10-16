<template>
  <Nav/>
  <Index msg="Placeholder Header"/>
</template>

<script>
import Nav from './components/Nav.vue'
import Index from './components/Index.vue'

export default {
  name: 'App',
  components: {
    Nav,
    Index,
  }
}
</script>

<style src="./assets/tailwind.css"/>
