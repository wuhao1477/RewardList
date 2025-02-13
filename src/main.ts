import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import Root from './Root.vue'
import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(Root)
app.use(createPinia())
app.use(router)
app.mount('#app') 