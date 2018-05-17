<template>
  <div class="IntensityGraph">
    <svg width="500" height="270">
      <g style="transform: translate(0, 10px)">
        <path :d="line" />
      </g>
    </svg>
  </div>
</template>

<script>
//change the path accordingly
import * as mqttClient from './mqtt.js'
var d3 = require('d3')

export default {
  name: 'IntensityGraph',
  data () {
    return {
      data: [99, 71, 78, 25, 36, 92],
      line: '',
    }
  },

  mounted() {
    // Change topic and server accordingly
    mqttClient.connect('position');
    mqttClient.sub()
    mqttClient.setOnMessage(this.onMessage)
    this.calculatePath()
  },
  beforeDestroy() {
    mqttClient.endConnection()
  },
  methods: {
    // change onMessage to fit the need of the graph
    onMessage(topic, msg) {
      console.log(msg)
      this.msg = msg.toString()
    },
    //Define funcions that draws the graph and call in mounted
    getScales() {
      const x = d3.scaleTime().range([0, 430]);
      const y = d3.scaleLinear().range([210, 0]);
      d3.axisLeft().scale(x);
      d3.axisBottom().scale(y);
      x.domain(d3.extent(this.data, (d, i) => i));
      y.domain([0, d3.max(this.data, d => d)]);
      return { x, y };
    },
    calculatePath() {
      const scale = this.getScales();
      const path = d3.line()
        .x((d, i) => scale.x(i))
        .y(d => scale.y(d));
      this.line = path(this.data);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
svg {
  margin: 25px;
}
path {
  fill: none;
  stroke: #76BF8A;
  stroke-width: 3px;
}
</style>
