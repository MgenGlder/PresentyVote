<template>
  <pie-chart :chartData="pieData" class="pie-chart" ref="pie"/>
</template>

<script>
// @ is an alias to /src
import { firestore, firebase } from "../main";
import PieChart from "./Chart";

export default {
  name: "Data",
  data() {
    return {
      initialSnapshot: true,
      date: new Date().toDateString(),
      pieData: {
        datasets: [
          {
            label: "Voting Metrics",
            data: [0, 0, 0],
            backgroundColor: ["#fb8c00", "#4caf50", "#ff5252"]
          }
        ],

        labels: ["Normal", "Strong", "Weak"]
      }
    };
  },
  components: {
    PieChart
  },
  firestore: function() {
    return {
      topics: firestore.collection(this.date),
      currentBallot: firestore.collection(this.date).doc("current-ballot")
    };
  },
  mounted() {
    this.$watch("currentBallot", newVal => {
      firestore
        .collection(this.date)
        .doc(newVal.name)
        .collection("votes")
        .onSnapshot(votes => {
          let voteObjects = votes.docs;
          this.pieData.datasets[0].data[0] = 0;
            this.pieData.datasets[0].data[1] = 0;
            this.pieData.datasets[0].data[2] = 0;
            let rawCounts = { normal: 0, strong: 0, weak: 0}
          voteObjects.map(currentVote => {
            let rawVote = currentVote.data();
            switch (rawVote.type) {
                case "normal":
                    rawCounts.normal += 1;
                    break;
                case 'strong':
                    rawCounts.strong += 1;
                    break;
                case 'weak':
                    rawCounts.weak += 1;
                    break;
            }
            
          });
          let totalCounts = rawCounts.normal + rawCounts.weak + rawCounts.strong;
          let strongPercentage = rawCounts.strong / totalCounts
          let normalPercentage = rawCounts.normal / totalCounts
          let weakPercentage = rawCounts.weak / totalCounts
          this.pieData.datasets[0].data[0] = Math.round(normalPercentage * 100)
          this.pieData.datasets[0].data[1] = Math.round(strongPercentage * 100)
          this.pieData.datasets[0].data[2] = Math.round(weakPercentage * 100)
          this.$refs['pie'].$data._chart.update();
        });
    });
  }
};
</script>
<style>
.pie-chart {
  width: 200px;
  height: 200px;
}
</style>
