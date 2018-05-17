<template lang="html">
  <div class="">
    <div id="sleep-time-container" class="svg-sleep-time-container">
    </div>
  </div>
</template>

<script>
  var CreateBedroomDurationSVG = require("../../helpers/Create_Bedroom_Duration_SVG.js");
  // import * as mqttClient from "./../../util_modules/mqtt.js"
  import jsonConfig from "../../config/config.json";
  var d3 = require("d3");
  // var spruceLivingStatusTopic = jsonConfig.spruceLivingStatus;
  // var dummuyTopic = jsonConfig.dummuyTopic
  // console.log("sprucePostionTopic is", spruceLivingStatusTopic)

  var data = [];
  var initialEnter = true;
  var initialLeft = true;
  var startSetTimeout;
  var startInnerSetTimeout;
  export default {
    mounted() {
      this.createBedroomDurationSVG();
      // mqttClient.connect(dummuyTopic);
      // mqttClient.sub();
      // mqttClient.setOnMessage(this.onMessage);
      // this.calculateTimeinBedElapsed(1);
    },
    beforeDestroy() {
      // mqttClient.endConnection();
      data = [];
    },
    methods: {
      createBedroomDurationSVG() {
        CreateBedroomDurationSVG.CreateBedroomDurationSVG();
      },
      // onMessage(topic, msg) {
      //   if (topic === dummuyTopic) {
      //     console.log("Inside dummuyTopic onMessage");
      //     this.handleSpruceLivingStatus(msg);
      //   }
      // },
      // handleSpruceLivingStatus(msg) {
      //   var payload;
      //   var newData;
      //   try {
      //     payload = JSON.parse(msg);
      //     var time = new Date();
      //     console.log("payload is ", payload);
      //     var name = payload.name;
      //     var status = payload.status;
      //     newData = {name: name, status: status, timeStamp: time};
      //   } catch (e) {
      //     console.log(e)
      //   }
      //   this.update(newData)
      // },
      // update(newData) {
      //   console.log("new Data is ", newData);
      //   var presenceIndicatorColor = d3.select("#presenceCircleIndicator");
      //   var actionTime = d3.select(".actionTime");
      //   var actionLocation = d3.select(".actionLocation");
      //   var locationName = newData.name;
      //   var startingTime = newData.timeStamp;
      //
      //   if (newData.status) {
      //     clearTimeout(startInnerSetTimeout);
      //     clearTimeout(startSetTimeout);
      //     actionTime.text("Now")
      //     actionLocation.text("Enter " + newData.name );
      //     presenceIndicatorColor.transition().style("fill", "#45E11F").duration(1000);
      //   } else {
      //     clearTimeout(startInnerSetTimeout);
      //     clearTimeout(startSetTimeout);
      //     actionTime.text("Now")
      //     actionLocation.text("Leave " + newData.name);
      //     presenceIndicatorColor.transition().style("fill", "#D8341A").duration(1000);
      //   }
      //   this.calculateTimeinBedElapsed(startingTime, actionTime, actionLocation, locationName, newData.status)
      // },
      // calculateTimeinBedElapsed(startingTime, actionTime, actionLocation, locationName, status) {
      //   var time = 0;
      //   var elapsed = 0;
      //   function instance() {
      //     time += 1000;
      //     elapsed = Math.floor(time / 1000);
      //     console.log("elapsed is ", elapsed);
      //     var inMinute = elapsed / 60;
      //     var inHour = elapsed / 3600;
      //     var inDay = elapsed / 86400;
      //     if (Math.floor(inMinute) >= 1 && Math.floor(inHour) == 0 && Math.floor(inDay) == 0) {
      //       var minuteFixedDigit = inMinute.toFixed(1);
      //       console.log("In minute", minuteFixedDigit);
      //       actionTime.text(minuteFixedDigit + " mins ago")
      //       if (status) {
      //         actionLocation.text("Entered " + locationName)
      //       } else {
      //         actionLocation.text("Left " + locationName)
      //       }
      //     } else if (Math.floor(inMinute) >= 60 && Math.floor(inHour) >= 1 && Math.floor(inDay) == 0) {
      //       var hourFixedDigit = inHour.toFixed(1);
      //       console.log("In hour", hourFixedDigit);
      //       actionTime.text(hourFixedDigit + " hours ago")
      //       if (status) {
      //         actionLocation.text("Entered " + locationName)
      //       } else {
      //         actionLocation.text("Left " + locationName)
      //       }
      //     } else if (Math.floor(inMinute) >= 1440 && Math.floor(inHour) >= 24 && Math.floor(inDay) >= 1) {
      //       var dayFixedDigit = inDay.toFixed(1);
      //       console.log("Inday", dayFixedDigit);
      //       actionTime.text(dayFixedDigit + " days ago")
      //       if (status) {
      //         actionLocation.text("Entered " + locationName)
      //       } else {
      //         actionLocation.text("Left " + locationName)
      //       }
      //     }
      //     var diff = (new Date().getTime() - startingTime) - time;
      //     startInnerSetTimeout = setTimeout(instance, 1000 - diff);
      //   }
      //   startSetTimeout = setTimeout(instance, 1000);
      // }
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
