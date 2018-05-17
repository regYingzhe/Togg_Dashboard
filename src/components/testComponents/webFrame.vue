<template>
  <div class='frame'>
    <iframe
    :src="ip"
    :width="width"
    :height="height"
    frameborder="0"
    scrolling="no"
    background-color="#EEEEEE"
    >
    </iframe>
  </div>
</template>

<script>
  import * as d3 from 'd3'
  export default {
    props: ['ip', 'width', 'height'],
    name: 'frame'
  }
</script>
