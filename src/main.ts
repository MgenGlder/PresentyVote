import Vue from 'vue'
// @ts-ignore
import VueFirestore from 'vue-firestore'
// import Firebase from 'firebase'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

require('firebase/firestore');

Vue.config.productionTip = false

Vue.use(VueFirestore)

// @ts-ignore
console.log('new stuff right before here...dsds');

let displayedMessage = false;

//@ts-ignore
console.log('something is happening')

console.log('finally done!!!');
// @ts-ignore
const firestore = top.window.firebase.firestore();
console.log(firestore);

// @ts-ignore
console.log('got past here!!!')
new Vue({
  router,
  store,
  render: h => h(App),
  // @ts-ignore
  firestore () {
    console.log("we got in here????")
    return {
      ballots: {
        objects: true,
        resolve: (data: any) => {
            // collection is resolved
            console.log('got the data', data);
        },
        reject: (err: any) => {
            // collection is rejected
            console.log('got an error', err);
        },
        ref: firestore.collection('Wed Jun 10 2020')
      }
    }
  }
}).$mount('#app')

export { firestore }