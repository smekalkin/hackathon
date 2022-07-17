import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import i18n from './lang';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

import Maska from 'maska';

import arr from './plugins/arr';
import str from './plugins/str';
import toast from './plugins/toast';

import './assets/fontawesome-free-6.1.1-web/css/all.min.css'
import './assets/css/app.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(i18n)

app.use(PrimeVue)
app.use(ToastService)
app.directive('tooltip', Tooltip)

app.use(Maska)

app.use(arr)
app.use(str)
app.use(toast)

app.mount('#app')
