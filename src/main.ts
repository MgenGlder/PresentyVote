import Vue from 'vue'
// @ts-ignore
import VueFirestore from 'vue-firestore'
// import Firebase from 'firebase'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

Vue.use(VueFirestore)

Vue.use(Vuetify)

const vuetify = new Vuetify({})

// @ts-ignore
const firestore = window.firebase.firestore();
// @ts-ignore
const firebase = window.firebase;
console.log("What the hell. Don't look in here you freak. Mind your business.")

new Vue({
  router,
  store,
  render: h => h(App),
  vuetify
}).$mount('#app')

export { firestore, firebase }