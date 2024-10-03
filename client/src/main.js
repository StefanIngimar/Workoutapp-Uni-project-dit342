// import App from './App.vue'

import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import App from './App.vue'
import router from './router'
import { createVfm } from 'vue-final-modal'
import 'vue-final-modal/style.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
const app = createApp(App)
const vfm = createVfm()
app.use(vfm)
app.use(createBootstrap())
app.use(router)
app.mount('#app')
