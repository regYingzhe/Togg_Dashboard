<template>
  <div class='speed'>
    <h1 style="text-align:center;font-size:20"> 20 m/s </h1>
  </div>
</template>

<script>
  import * as d3 from 'd3'
  import io from 'vue-socket.io'
  export default {
    props: ['ip', 'width', 'height'],
    name: 'frame',
    mounted() {
      var speed = 20
    }
  }
</script>
