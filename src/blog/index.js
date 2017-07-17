import Vue from 'vue'
import App from './app.vue'

import Headex from '../components/headex.vue';
import Footex from '../components/footex.vue';

Vue.component('headex', Headex)
Vue.component('footex', Footex)


/* 实例化一个vue */
new Vue({
  el: '#app',
  render: h => h(App)
})