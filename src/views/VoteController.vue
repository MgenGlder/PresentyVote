<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">There seems to be a collision</v-card-title>

        <v-card-text>
          Noticed that the voting hasn't been instantiated yet
          <br />
          <br />Instantiate now?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="instantiateVoting">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <iframe v-if="!isLocalHost()" class="iframe-placeholder" src="https://vote.kunle.io"></iframe>
    <div v-if="isLocalHost()" class="iframe-placeholder">Space for the iframe</div>

    <div class="iframe-controls">
      <div
        v-if="!(currentBallot !== null && typeof currentBallot == 'object' && currentBallot.name == 'start')"
        @click="previousBallot"
      >
        <v-btn :disabled="(currentQuestionIndex == 0)">Previous</v-btn>
      </div>
      <div
        v-if="currentBallot !== null && typeof currentBallot == 'object' && currentBallot.name == 'start'"
        @click="enableVotingOption(0)"
      >
        <v-btn>Start First Question</v-btn>
      </div>
      <div v-else>
        <v-btn v-if="!isPaused" @click="pauseVoting">Pause</v-btn>
        <v-btn v-if="isPaused" @click="unPauseVoting">Unpause</v-btn>
      </div>
      <div
        v-if="!(currentBallot !== null && typeof currentBallot == 'object' && currentBallot.name == 'start')"
      >
        <v-btn
          v-if="!isTransition && !(currentQuestionIndex >= votingQuestions.length - 1)"
          @click="transitionVoting"
        >Transition</v-btn>
        <v-btn v-else-if="currentQuestionIndex >= votingQuestions.length - 1" @click="endVoting">End</v-btn>
        <v-btn @click="nextBallot" v-else>Next</v-btn>
      </div>
    </div>
    <div>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>Voting Questions</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div v-for="(item, i) in votingQuestions" :key="i">{{item.title}}</div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { firestore, firebase } from "../main";

export default {
  name: "VoteController",
  methods: {
    previousBallot() {
      if (this.currentQuestionIndex != 0) {
        this.currentQuestionIndex -= 1;
        firestore
          .collection(this.date)
          .doc("current-ballot")
          .set({
            name: this.votingQuestions[this.currentQuestionIndex].title
          });
      }
    },
    endVoting() {
      firestore
        .collection(this.date)
        .doc("current-ballot")
        .set({
          name: "end"
        });
    },
    transitionVoting() {
      this.isTransition = true;
      firestore
        .collection(this.date)
        .doc("current-ballot")
        .set({
          name: "transition"
        });
    },
    nextBallot() {
      this.isTransition = false;
      this.currentQuestionIndex += 1;
      firestore
        .collection(this.date)
        .doc("current-ballot")
        .set({
          name: this.votingQuestions[this.currentQuestionIndex].title
        });
    },
    isLocalHost() {
      return window.location.host.includes("localhost");
    },
    pauseVoting() {
      firestore
        .collection(this.date)
        .doc("current-ballot")
        .set({
          name: "pause"
        })
        .then(() => {
          this.isPaused = true;
        });
    },
    unPauseVoting() {
      firestore
        .collection(this.date)
        .doc("current-ballot")
        .set({
          name: this.votingQuestions[this.currentQuestionIndex].title
        })
        .then(() => {
          this.isPaused = false;
        });
    },
    enableVotingOption(votingOption) {
      firestore
        .collection(this.date)
        .doc("current-ballot")
        .set({
          name: this.votingQuestions[this.currentQuestionIndex].title
        });
    },
    instantiateVoting() {
      firestore
        .collection(this.date)
        .doc("current-ballot")
        .set({
          name: "start"
        })
        .then(() => {
          location.reload();
        });
    }
  },
  data() {
    return {
      isTransition: false,
      isPaused: false,
      date: new Date().toDateString(),
      dialog: false,
      currentQuestionIndex: 0,
      votingQuestions: [
        { title: "Vision" },
        { title: "Mission" },
        { title: "Autonomy" },
        { title: "Risk" },
        { title: "Being Remote" },
        { title: "Users" },
        { title: "Stakeholders" },
        { title: "Codebase" },
        { title: "Shipping" },
        { title: "Space and Equipment" },
        { title: "Continuous Improvement" },
        { title: "Personal Development" },
        { title: "Fun!" }
      ]
    };
  },
  firestore: function() {
    return {
      topics: firestore.collection(this.date),
      currentBallot: firestore.collection(this.date).doc("current-ballot")
    };
  },
  mounted() {
    setTimeout(() => {
      console.log("topics", this.topics);
      if (
        Object.prototype.hasOwnProperty.call(this.topics, "length") &&
        this.topics.length == 0
      ) {
        console.log("No topic");
        this.dialog = true;
      }
    }, 1000);
  }
};
</script>
<style>
.iframe-placeholder {
  width: 80%;
  height: 80vh;
  background-color: lightgrey;
  margin: auto;
}

.iframe-controls {
  display: flex;
  justify-content: space-around;
}
</style>
