<template lang="html">
  <div class="">
    <div id="toilet-time-container" class="svg-toilet-time-container">
    </div>
  </div>
</template>

<script>
  var CreateBathroomDurationSVG = require("../../helpers/Create_Bathroom_Duration_SVG.js");
  // console.log("topic config is ", jsonConfig);
  export default {
    mounted() {
      this.CreateBathroomDurationSVG();
    },
    methods: {
      CreateBathroomDurationSVG() {
        CreateBathroomDurationSVG.CreateBathroomDurationSVG();
      },
    }
  }
</script>

<style scoped>
.svg-toilet-time-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  vertical-align: top;
  overflow: hidden;
}

.svg-toilet-time-content {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
