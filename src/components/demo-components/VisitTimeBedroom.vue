<template lang="html">
  <div class="">
    <div id="visit-bedroom-container" class="svg-visit-bedroom-container">
    </div>
  </div>
</template>

<script>
  var CreateBedroomFrequencySVG = require("../../helpers/Create_Bedroom_Frequency_SVG.js");
  // console.log("topic config is ", jsonConfig);
  export default {
    mounted() {
      this.CreateBedroomFrequencySVG();
    },
    methods: {
      CreateBedroomFrequencySVG() {
        CreateBedroomFrequencySVG.CreateBedroomFrequencySVG();
      },
    }
  }
</script>

<style scoped>
.svg-visit-bedroom-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  vertical-align: top;
  overflow: hidden;
}

.svg-visit-bedroom-content {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
