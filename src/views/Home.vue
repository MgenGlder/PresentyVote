<template>
  <div class="home">
  <template>
    <transition name="start-loading">
      <div class="start-loading"  v-if="topics.length === 0"> 
        <div>Please wait.. Loading. Voting will begin shortly.</div>
        <div class="progress-bar-wrapper">
          <v-progress-linear indeterminate></v-progress-linear>
        </div>
      </div>
    </transition>
  </template>
  <template >
   <v-dialog v-model="dialog" persistent max-width="500">
     <v-card>
        <v-card-title class="headline">There seems to be a collision</v-card-title>

        <v-card-text>
          <!-- This means that the fingerprinting software recognised that someone else in this voting experience somehow has your same fingerprint. <br> <br>
          This could lead to unexpected behavior, including your vote being overwritten by that person. <br> <br> -->

          <!-- Thankfully this can be fixed by generating a new fingerprint for you. Would you like me to do that now? -->
          There was a fingerprint key collision. <br><br>Would you like me to generate a new one for you?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="enableStandby()"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-dialog
      v-model="fingerprintDialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    </v-dialog>

    <transition name="poll-wrapper">
        <div class="poll-wrapper" v-if="topics.length !== 0 && currentBallot.name !== 'transition' && currentBallot.name !== 'end'">
        <v-alert
          style="position: absolute; top: 20px;"
          :value="showAlertDialog"
          dismissible
          close-icon="mdi-delete"
          transition="scale-transition"
          dense
          outlined
          type="error"
        >
          Please re-vote.
        </v-alert>
        <div class="pause-loader-wrapper">
          <v-progress-circular
            indeterminate
            color="primary" 
            v-if="displayLoading"
            class="progress-circular">
          </v-progress-circular>
        <div class="pills-wrapper">
          <v-chip class="current-ballot" :outlined='true' value="something" :color='chosenColor' v-if="!displayLoading || initialLoadFinished">{{currentBallot.name}}</v-chip>
          <!-- <v-chip class="selection-pill" :pill="true" :outlined="true" color="#033">{{currentSelection}}</v-chip> -->
        </div>
        <div class="button-wrapper">
          <v-btn x-large color="success" @click="vote('strong')" class="button__green" :disabled="displayLoading">Strong</v-btn>
        </div>
        <div class="button-wrapper">
          <v-btn x-large color="warning" @click="vote('normal')" class="button__yellow" :disabled="displayLoading">Normal</v-btn>
        </div>
        <div class="button-wrapper">
          <v-btn x-large color="error" @click="vote('weak')" class="button__red" :disabled="displayLoading">Weak</v-btn>
        </div>
      </div>
      </div>
      <span class="finished" v-if="currentBallot.name === 'end'">
        <v-chip
          class="ma-2"
          color="teal"
          text-color="white"
        >
          <v-avatar left>
            <v-icon>mdi-checkbox-marked-circle</v-icon>
          </v-avatar>
          Voting Finished!
        </v-chip>
      </span>
      <div class="skeleton-loader" v-if="currentBallot.name === 'transition'">
          <div class="wait-text-skeleton">Please wait for the next question...</div>
          <v-skeleton-loader class="mx-auto" type="button, button, button" max-width="300">
          </v-skeleton-loader>
      </div>
    </transition>
    </template>
  </div>
</template>

<script>
// @ is an alias to /src
import { firestore, firebase } from '../main'
import Fingerprint from 'fingerprintjs2'

export default {
  name: 'Home',
  data() {
    return {
      fingerprintDialog: false,
      dialog: false,
      date: new Date().toDateString(),
      displayLoading: true,
      fingerprint: null,
      initialLoadFinished: false,
      currentSelection: null,
      initialSnapshot: true,
      voteSubscription: null,
      showAlertDialog: false
    }
  },
  firestore: function () {
    return {
      topics: firestore.collection(this.date),
      'currentBallot': firestore.collection(this.date).doc('current-ballot')
    }
  },
  computed: {
    chosenColor() {
      switch(this.currentSelection) {
        case 'strong': 
          return '#339933'
        case 'normal':
          return '#FF9900'
        case 'weak':
          return '#FF0000'
        default:
          return ''
      }
    }
  },
  watch: {
    initialLoadFinished(val) {
      if( val == true && this.fingerprint !== null) {
        this.collisionDetection();
      }
    }
  },
  mounted () {
    this.$watch('currentBallot', function (newVal, oldVal) {
      console.log("currentBallot", newVal, oldVal);
      if ((oldVal === undefined || oldVal === null || oldVal.length === 0) && this.fingerprint != null){
        console.log("First branching logic")
        this.displayLoading = false;  
        this.initialLoadFinished = true;
      } else if (this.fingerprint == null) {
        alert('Fingerprinting failure.')
      } else if (newVal.name === '') {
        console.log('new val == empty string')
      }
      
      if (newVal.name === 'end') {
        console.error('Voting is ending');
      }
    });
    this.$watch('topics', function(newVal, oldVal) {
      console.log('newVal - topic', newVal)
      console.log('oldVal - topic', oldVal)
    });
    console.log(this.topics)
    const nunce = this.getOrCreateNunce();
    // console.log('Nunce that we just got!', nunce);
    this.generateNewFingerprint(nunce);
  },
  methods: {
    async enableStandby() {
      this.showAlertDialog = true;
      this.dialog = false;
      this.fingerprintDialog = true;
      await this.generateNewFingerprint(Math.random() * 100)
      this.collisionDetection()
      this.currentSelection = null;
      setTimeout(() => {
        this.fingerprintDialog = false;
      }, 1000);
    },
    getOrCreateNunce() {
      const nonce = window.localStorage.getItem("nonce")
      // console.log('nonce', nonce, typeof nonce);
      if (nonce === undefined || nonce == null || isNaN(parseFloat(nonce))) {
        // Warning: This clears all of local storage. May have unintended consequences.
        // window.localStorage.clear();
        // alert('There was an error parsing your nonce');
        // throw new Error("Can't parse nonce");
        const newNonce = Math.random() * 100;
        window.localStorage.setItem('nonce', newNonce)
        return newNonce;
      } else {
        return nonce;
      }
      
    },
    async generateNewFingerprint(nonce) {
      const that = this;
      Fingerprint.get(function(mainComponent) {
        const values = mainComponent.map(function (component) { return component.value })
        values.push(nonce)
        const murmur = Fingerprint.x64hash128(values.join(''), 31)
        that.fingerprint = murmur;
      })
      await Fingerprint.getPromise().then(function(mainComponent) {
        const values = mainComponent.map(function (component) { return component.value })
        values.push(nonce)
        const murmur = Fingerprint.x64hash128(values.join(''), 31)
        that.fingerprint = murmur;
      })
    },
    vote(type) {
      this.showAlertDialog = false;
      this.currentSelection = type
      this.displayLoading = true
      firestore.collection(this.date).doc(this.currentBallot.name).collection('votes').doc(this.fingerprint).set({type: type, timeVoted: firebase.firestore.Timestamp.fromDate(new Date())}).then(() => this.displayLoading = false)
    },
    collisionDetection() {
      this.voteSubscription = firestore.collection(this.date)
              .doc(this.currentBallot.name)
              .collection("votes")
              .doc(this.fingerprint)
              .onSnapshot(vote => {
                if (this.initialSnapshot) {
                  this.initialSnapshot = false;
                } else if (vote.data().type !== this.currentSelection && !this.initialSnapshot) {
                  this.dialog = true
                }
              })
    }
  }
}
</script>
<style>
  /* Potential Countdown CSS Ticker Code  */
  /* https://codepen.io/marcosmou/pen/VjrwAR */
  @import '~material-design-icons/iconfont/material-icons.css';
  .finished {
    display: flex;
    height: 100vh;
    width: 100vw;
    align-items: center;
    justify-content: center;
  }
  .pause-loader-wrapper {
    /* margin-top: -32px; */
    position: relative;
  }
  .progress-circular {
    position: absolute !important;
    top: 50%;
    z-index: 99;
    left: 21px;
    left: 50%;
    margin-left: -16px !important;
  }
  .wait-text-skeleton {
    margin-bottom: 20px;
  }
  .v-skeleton-loader__button.v-skeleton-loader__bone {
    margin-bottom: 20px;
    width: 215px;
    height: 52px;
  }
  .progress-bar-wrapper {
    width: 100%;
  }
  .poll-wrapper-leave-active {
    transition: background-color 1s;
    transition: opacity 1s;
  }
  .poll-wrapper-leave-to {
    background-color: lightgreen;
    opacity: 0;
  }
  .poll-wrapper-enter-to {
    background-color: white;
  }
  .poll-wrapper-enter-active {
    transition: background-color 2s;
    transition-delay: 1.5s
  }
  .poll-wrapper-enter {
    background-color: green;
  }
  .start-loading {
    background-color: black;
    height: 100vh;
    width: 100vw;

    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 40px;
    flex-direction: column;
  }
  .start-loading-leave-active {
    transition: background-color 1.5s;
  }
  .start-loading-leave-to {
    background-color: green;
  }
  .pills-wrapper {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .selection-pill {
    display: inline;
  }
  .poll-wrapper,  .skeleton-loader {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .button-wrapper {
    margin-bottom: 20px;
  }
  .button__green, .button__yellow, .button__red {
    min-width: 215px !important;
  }
  .button__green {
    background-color: green !important;
  }
  .button__yellow {
    background-color: orange !important;

  }
  .button__red {
    background-color: red !important;
  }
  .v-card__title.headline, .v-card__text {
    font-family: Roboto,sans-serif !important;
  }

  .v-card__text {
    font-size: 17px;
  }
  .v-card__title {
    text-align: center !important;
    display: block;
  }


</style>
