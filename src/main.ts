import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {MotionPlugin} from '@vueuse/motion'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()


app.use(pinia).use(router).use(MotionPlugin).mount('#app')
