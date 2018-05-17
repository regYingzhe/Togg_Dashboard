<template lang="html">
  <div class="">
    <div id="indicator-container" class="svg-indicator-container">
    </div>
  </div>
</template>

<script>
    var createIndicatorBoxSVG = require("../../helpers/Create_Indicator_Box_SVG.js");
    import * as mqttClient from "./../../util_modules/mqtt.js"
    import jsonConfig from "../../config/config.json";
    var d3 = require("d3");
    // var dummuyTopic = jsonConfig.dummuyTopic;
    var locationStatus = jsonConfig.locationStatus;
    console.log("locationStatus is ", locationStatus);
    var startSetTimeout;
    var startInnerSetTimeout;
    var prevStatus;
    var currentStatus;
    var counter = 0;
    var presenceIndicatorColor;
    var actionTime;
    var actionLocation

    export default {
      mounted() {
        this.createIndicatorBoxSVG();
        mqttClient.connect(locationStatus);
        // mqttClient.connect(dummuyTopic);
        mqttClient.sub();
        mqttClient.setOnMessage(this.onMessage);
      },
      beforeDestroy() {
        mqttClient.endConnection();
        counter = 0;
      },
      methods: {
        createIndicatorBoxSVG() {
          createIndicatorBoxSVG.createIndicatorBoxSVG();
        },
        onMessage(topic, msg) {
          // if (topic === locationStatus) {
          //   console.log("Inside dummuyTopic onMessage");
          //   this.handleSpruceLivingStatus(msg);
          // }
          if (topic === locationStatus) {
            console.log("Inside locationStatus onMessage");
            this.handleSpruceLivingStatus(msg);
          }
        },
        handleSpruceLivingStatus(msg) {
          var payload;
          var newData;
          try {
            payload = JSON.parse(msg);
            var time = new Date();
            var name = payload.name;
            var status = payload.status;
            newData = {name: name, status: status, timeStamp: time};
            console.log("payload is ", newData);
          } catch (e) {
            console.log(e)
          }
          this.update(newData)
        },
        update(newData) {
          presenceIndicatorColor = d3.select("#presenceCircleIndicator");
          actionTime = d3.select(".actionTime");
          actionLocation = d3.select(".actionLocation");
          var locationName = newData.name;
          var startingTime = newData.timeStamp;
          var currentStatus = newData.status;

          if (counter == 0) {
            prevStatus = currentStatus;
            this.generateStatusText(newData);
            this.calculateTimeinBedElapsed(startingTime, locationName, currentStatus)
          } else {
            if (prevStatus !== currentStatus) {
              this.clearTimer();
              prevStatus = currentStatus;
              counter = 0;
              this.generateStatusText(newData);
              this.calculateTimeinBedElapsed(startingTime, locationName, currentStatus)
            }
          }
          counter += 1;
          console.log("counter is ", counter);
        },
        clearTimer() {
          console.log("Inside clear timer")
          clearTimeout(startInnerSetTimeout);
          clearTimeout(startSetTimeout);
        },
        generateStatusText(newData) {
          actionTime.text("Now");
          if (newData.status) {
            actionLocation.text("Enter " + newData.name );
            presenceIndicatorColor.transition().style("fill", "#45E11F").duration(1000);
          } else {
            actionLocation.text("Leave " + newData.name);
            presenceIndicatorColor.transition().style("fill", "#D8341A").duration(1000);
          }
        },
        calculateTimeinBedElapsed(startingTime, locationName, status) {
          var time = 0;
          var elapsed = 0;
          function instance() {
            time += 1000;
            elapsed = Math.floor(time / 1000);
            var inMinute = elapsed / 60;
            var inHour = elapsed / 3600;
            var inDay = elapsed / 86400;
            console.log("elapsed is ", elapsed);
            if (Math.floor(inMinute) >= 1 && Math.floor(inHour) == 0 && Math.floor(inDay) == 0) {
              var minuteFixedDigit = inMinute.toFixed(1);
              console.log("In minute", minuteFixedDigit);
              actionTime.text(minuteFixedDigit + " mins ago")
              if (status) {
                actionLocation.text("Entered " + locationName)
              } else {
                actionLocation.text("Left " + locationName)
              }
            } else if (Math.floor(inMinute) >= 60 && Math.floor(inHour) >= 1 && Math.floor(inDay) == 0) {
              var hourFixedDigit = inHour.toFixed(1);
              console.log("In hour", hourFixedDigit);
              actionTime.text(hourFixedDigit + " hours ago")
              if (status) {
                actionLocation.text("Entered " + locationName)
              } else {
                actionLocation.text("Left " + locationName)
              }
            } else if (Math.floor(inMinute) >= 1440 && Math.floor(inHour) >= 24 && Math.floor(inDay) >= 1) {
              var dayFixedDigit = inDay.toFixed(1);
              console.log("Inday", dayFixedDigit);
              actionTime.text(dayFixedDigit + " days ago")
              if (status) {
                actionLocation.text("Entered " + locationName)
              } else {
                actionLocation.text("Left " + locationName)
              }
            }
            var diff = (new Date().getTime() - startingTime) - time;
            startInnerSetTimeout = setTimeout(instance, 1000 - diff);
          }
          startSetTimeout = setTimeout(instance, 1000);
        }
      }
    }
</script>

<style scoped>
  .svg-indicator-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    vertical-align: top;
    overflow: hidden;
  }

  .svg-indicator-content {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
