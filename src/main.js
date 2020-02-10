import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import './assets/scss/app.scss'

Vue.use(Buefy, {
  defaultFieldLabelPosition: 'on-border'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) },
  mounted() {
    store.dispatch('STARTUP');
  }
}).$mount('#app')
