<template lang="html">
  <div class="">
    <div id="sleep-time-container" class="svg-sleep-time-container">
    </div>
  </div>
</template>

<script>
    var createBathroomDurationSVG = require("../../helpers/Create_Bathroom_Duration_SVG.js");
    // console.log("topic config is ", jsonConfig);
    export default {
      mounted() {
        this.createBathroomDurationSVG();
      },
      methods: {
        createBathroomDurationSVG() {
          createBathroomDurationSVG.createBathroomDurationSVG();
        },
      }
    }
</script>

<style scoped>
  .svg-sleep-time-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    vertical-align: top;
    overflow: hidden;
  }

  .svg-sleep-time-content {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
