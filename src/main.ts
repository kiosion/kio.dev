//import * as Vue from 'vue'
//import * as VueRouter from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue' // Import main view
import './assets/tailwind.css' // Import tailwind CSS

// const routes = [
//     //TODO
// ]

// const router = VueRouter.createRouter({
//     history: VueRouter.createWebHistory(),
//     routes,
// })

//Vue.createApp(App).use(router).mount('#app')

createApp(App).mount('#app') // Create app