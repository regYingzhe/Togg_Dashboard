<template>
  <div>
    <canvas width=400 height=150 id="chart"></canvas>
  </div>
</template>
<script>
import * as io from 'vue-socket.io'
import * as chartStreaming from 'chartjs-plugin-streaming'
import * as moment from 'moment'
export default {
  mounted() {
    var socket = io.connect()
    var ctx = document.getElementById('chart').getContext('2d')
    var data = {
      labels: [0],
      datasets: [{
        data: [0],
        label: 'Temperature',
        backgroundColor: '#ff6600'
      }]
    }
    var optionsAnimations = { animation: false }
    var chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: optionsAnimations
    })

    socket.on('temperature', function (value) {
      var length = data.labels.length
      if (length >= 20) {
        data.datasets[0].data.shift()
        data.labels.shift()
      }

      data.labels.push(moment().format('HH:mm:ss'))
      data.datasets[0].data.push(value)

      chart.update()
    })
  }
}
</script>
