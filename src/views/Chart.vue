<script>
import { firestore, firebase } from "../main";
import { Pie, mixins } from 'vue-chartjs';
let { reactiveProp } = mixins
export default {
  extends: Pie,
  props: ['options'],
  mixins: [ reactiveProp ],
  mounted() {
      this.renderChart(this.chartData, this.options)
  }
};
</script>
