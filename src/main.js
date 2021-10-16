//import * as Vue from 'vue'
//import * as VueRouter from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue' // Import main view
import './assets/tailwind.css' // Import tailwind CSS

// TODO: Fontawesome

// import the fontawesome core
//import { library } from '@fortawesome/fontawesome-svg-core'
// import specific icons
//import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
// import font awesome icon component
//import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// add icons to the library
//library.add(faUserSecret)
// add font awesome icon component
//Vue.component('font-awesome-icon', FontAwesomeIcon)
//Vue.config.productionTip = false

// const routes = [
//     //TODO
// ]

// const router = VueRouter.createRouter({
//     history: VueRouter.createWebHistory(),
//     routes,
// })

//Vue.createApp(App).use(router).mount('#app')

createApp(App).mount('#app') // Create app