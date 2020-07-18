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

require('firebase/firestore');

Vue.config.productionTip = false

Vue.use(VueFirestore)

Vue.use(Vuetify)

let displayedMessage = false;
let vuetify = new Vuetify({})

// @ts-ignore
const firestore = top.window.firebase.firestore();
// @ts-ignore
const firebase = top.window.firebase;
console.log("What the hell. Don't look in here you freak. Mind your business.")

new Vue({
  router,
  store,
  render: h => h(App),
  vuetify,
  // @ts-ignore
  firestore () {
    return {
      ballots: {
        objects: true,
        resolve: (data: any) => {
        },
        reject: (err: any) => {
        },
        ref: firestore.collection('Wed Jun 10 2020')
      }
    }
  }
}).$mount('#app')

export { firestore, firebase }