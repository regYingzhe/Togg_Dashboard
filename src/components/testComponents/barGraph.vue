<template>
    <svg class="bar-chart" width="100%" height="100%" style="max-width:100%;max-height: 100%" preserveAspectRatio="xMidYMid meet"></svg>
</template>

<script>
import * as mqttClient from '../../util_modules/mqtt.js'
import * as d3 from 'd3'
var pt = 13;

export default {
  name: 'bar-chart',
  props: ['width', 'barHeight', 'topic'],
  mounted() {
    mqttClient.connect(this.topic);
    mqttClient.sub()
    mqttClient.setOnMessage(this.onMessage)
    this.renderChart(pt)
  },
  beforeDestroy() {
    mqttClient.endConnection()
  },
  methods: {
    randData(n) {
      var output = [];
      output[0]=n;
      for(var i=1;i<6;i++) {
        output[i] = Math.floor(output[0] * (Math.random() + 1));
      }
      return output;
    },
    onMessage(topic, msg) {
      console.log('Message Received')
      console.log(msg.toString())
      this.pt = msg.toString()
      this.renderChart(this.pt)
    },
    renderChart(pt) {

      var data = this.randData(pt);
      var width = this.width
      var barHeight = this.barHeight

      var x = d3.scaleLinear()
          .domain([0, d3.max(data)])
          .range([0, width])

      var chart = d3.select(this.$el)
          .attr('width', width)
          .attr('height', barHeight * data.length)

      var d = chart.selectAll('g')
          .data(data)

      d.exit().remove()

      var g = d.enter().append('g')
          .merge(d)
          .attr('transform', function (d, i) { return 'translate(0,' + i * barHeight + ')' })
      g.selectAll('rect').remove()
      g.selectAll('text').remove()
      g.append('rect')
          .attr('width', x)
          .attr('height', barHeight - 1)
      g.append('text')
          .attr('x', function (d) { return x(d) - 3 })
          .attr('y', barHeight / 2)
          .attr('dy', '.35em')
          .text(function (d) { return d })
    }
  },
  watch: {
    width: 'renderChart',
    barHeight: 'renderChart'
  }
}
</script>

<style lang="scss">
.bar-chart {
  rect {
    fill: steelblue;
  }

  text {
    fill: white;
    font: 10px sans-serif;
    text-anchor: end;
  }
}
</style>
