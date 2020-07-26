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
            name: this.votingQuestions[this.currentQuestionIndex].title,
            description: this.votingQuestions[this.currentQuestionIndex].description
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
      this.isPaused = false;
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
          name: this.votingQuestions[this.currentQuestionIndex].title,
          description: this.votingQuestions[this.currentQuestionIndex].description
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
          name: this.votingQuestions[this.currentQuestionIndex].title,
          description: this.votingQuestions[this.currentQuestionIndex].description
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
          name: this.votingQuestions[this.currentQuestionIndex].title,
          description: this.votingQuestions[this.currentQuestionIndex].description
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
        { title: "Vision", description: "How strongly do I understand and believe in the vision of the business and product?" },
        { title: "Mission", description: "How strongly do I understand and believe in the mission of the team?"},
        { title: "Autonomy", description:  "How strongly do I feel we're empowered to make our own decisions as a team?" },
        { title: "Risk", description: "How strongly do I feel that I can take risks?"  },
        { title: "Being Remote", description: "How effectively can I work remotely?" },
        { title: "Users", description: "How strongly do I believe that we are responsive to the needs of our users?" },
        { title: "Stakeholders", description: "How strongly do I believe our stakeholders are highly enabled?" },
        { title: "Codebase", description: "How strongly do I believe our codebase is healthy?" },
        { title: "Shipping", description: "How strongly do I believe our code ships quickly and easily?"},
        { title: "Space and Equipment", description: "How strongly do I believe that I have the resources, space, and equipment I need to be successful?" },
        { title: "Continuous Improvement", description: "How strongly do I believe we continue to improve our process and practices?" },
        { title: "Personal Development", description: "How strongly do I believe my woek is helping me to improve as a professional?" },
        { title: "Fun!", description: "How strongly do I feel I'm having fun at work?" }
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
      if (
        Object.prototype.hasOwnProperty.call(this.topics, "length") &&
        this.topics.length == 0
      ) {
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
