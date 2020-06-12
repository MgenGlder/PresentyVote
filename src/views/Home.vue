<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    {{currentBallot.name}}
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { firestore } from '../main'
import Fingerprint from 'fingerprintjs2'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data() {
    return {
      date: new Date().toDateString()
    }
  },
  firestore: function () {
    console.log("we got in here????")
    return {
      topics: firestore.collection(this.date),
      'currentBallot': firestore.collection(this.date).doc('current-ballot')
    }
  },
  mounted () {
    console.log(this.$bindCollectionAsObject)
    console.log("firebase object", this.$firestore)
    console.log('topics', this.topics)
    console.log(this)
    // this.$firestore['current-ballot'].doc().get()
      Fingerprint.get(function(mainComponent) {
        const values = mainComponent.map(function (component) { return component.value })
        const murmur = Fingerprint.x64hash128(values.join(''), 31)
        alert(murmur)
        console.log(murmur)
    })
  }
}
</script>
