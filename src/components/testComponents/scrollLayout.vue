<template>
    <svg width=400 height=150 id="chart"></svg>
</template>
<script type="text/javascript "src="/socket.io/socket.io.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.0/Chart.bundle.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
<script>
// import * as io from 'vue-socket.io'
// import * as chartStreaming from 'chartjs-plugin-streaming'
// import * as moment from 'moment'
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
