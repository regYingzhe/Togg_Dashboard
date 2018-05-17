<template lang="html">
  <div class="">
    <div id="visit-restroom-container" class="svg-visit-restroom-container">
    </div>
  </div>
</template>

<script>
  var CreateBathroomFrequencySVG = require("../../helpers/Create_Bathroom_Frequency_SVG.js");
  // console.log("topic config is ", jsonConfig);
  export default {
    mounted() {
      this.CreateBathroomFrequencySVG();
    },
    methods: {
      CreateBathroomFrequencySVG() {
        CreateBathroomFrequencySVG.CreateBathroomFrequencySVG();
      },
    }
  }
</script>

<style scoped>
.svg-visit-restroom-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  vertical-align: top;
  overflow: hidden;
}

.svg-visit-restroom-content {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
