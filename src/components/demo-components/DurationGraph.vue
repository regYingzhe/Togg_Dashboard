<template lang="html">
  <div class="">
    <div id="duration-container" class="svg-duration-container">
    </div>
  </div>
</template>

<script>
  // Programming idea coming from
  // http://bl.ocks.org/DStruths/9c042e3a6b66048b5bd4
  var d3 = require("d3");
  var createSVG = require("../../helpers/createSVG.js");
  import jsonConfig from "../../config/config.json";

  // console.log("topic config is ", jsonConfig);
  export default {
    mounted() {
      this.createSVG();
    },
    methods: {
      createSVG() {
        createSVG.createSVG();
      },
    }
  }
</script>

<style scoped>
  .duration-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    vertical-align: top;
    overflow: hidden;
  }

  .svg-duration-content {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
  }

</style>
