import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false
Vue.use(new VueSocketIO({
  debug: false,
  connection: 'localhost:3001', // options object is Optional
  vuex: {
      store,
      actionPrefix: 'SOCKET_', // what?
      mutationPrefix: 'SOCKET_'
  }
  // options: { path: "/my-app/" } // Options object to pass into SocketIO
}))
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
