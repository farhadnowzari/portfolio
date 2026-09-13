import { createApp } from 'vue';
import './assets/styles/app.scss';
import vuetify from './plugins/vuetify';
import App from './App.vue';

createApp(App).use(vuetify).mount('#app');
