<template>
  <div class="">
    <div id="location-container" class="svg-location-container">
    </div>
  </div>
</template>

<script>
//change the path accordingly
import * as mqttClient from './../../util_modules/mqtt.js'
import * as furnitureUtils from './../../util_modules/furniture.js'
// var contents = fs.readFileSync("../../config/config.json");
import jsonConfig from "../../config/config.json";
// console.log("topic config is ", jsonConfig);
var locationTopic = jsonConfig.positionTopic;
console.log("position topic is", locationTopic);
var d3 = require('d3')
// var width = 491;
// var height = 500;
var outterWidth = 491;
var outterHeight = 500;
var margin = {top: 20, right: 20, bottom: 20, left: 20};
var width = outterWidth - margin.left - margin.right;
var height = outterHeight - margin.top - margin.bottom;
var transitionTime = 500;
var presenceState = {};
var oldestTime = 0;
var drawDot = -1;
// Color binding with different person
var color
var legendContainer
// x, y Axis Scale Setup
var xAxisScale
var yAxisScale
// Initialize Locations Dot Container
var locationContainer
// Initialize hovercard
var hovercard
// Initialize name selection
var nameContainer
// Initialize coordinate selection
var coordinateContainer

var svgViewPort
var svgDefs
var innerSpace
// draw x, y Axis
var xAxisGroup
var yAxisGroup
var margin
var updateFlag = false;
var transitionTime = 500;
var toiletSize = 110;
var bedSize = 150;
var toiletImg = require("../../assets/images/furniture/Rtoilet.png")
var bedImg = require("../../assets/images/furniture/bed_new.png")
var r = 0.05 * width;
// Color binding with different person
color = d3.scale.category10();

export default {
  name: 'LocationGraph',
  mounted() {
    // Change topic and server accordingly
    this.createSVG();
    mqttClient.connect(locationTopic);
    mqttClient.sub()
    mqttClient.setOnMessage(this.onMessage)
  },

  beforeDestroy() {
    mqttClient.endConnection()
  },
  methods: {
    createSVG() {
      svgViewPort = d3.select("div#location-container").append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + outterWidth + " " + outterHeight)
      .classed("svg-location-content", true);

      innerSpace = svgViewPort.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svgDefs = svgViewPort.append("svg:defs")

      legendContainer = innerSpace.append("g").attr("class", "legendContainer");

      // x, y Axis Scale Setup
      xAxisScale = d3.scale.linear().domain([0, 3.45]).range([0, width]).nice();
      yAxisScale = d3.scale.linear().domain([0, 4.0]).range([height, 0]);
      var xAxis = d3.svg.axis().scale(xAxisScale).orient("bottom");
      var yAxis = d3.svg.axis().scale(yAxisScale).orient("left");
      // draw x, y Axis
      xAxisGroup = innerSpace.append("g").attr("class", "location-x-axis").attr("transform", "translate(0," + height + ")").call(xAxis);
      yAxisGroup = innerSpace.append("g").attr("class", "location-y-axis").call(yAxis);

      xAxisGroup.style("display", "none");
      yAxisGroup.style("display", "none");

      // Draw the table in the fishbowl
      var table = innerSpace.append("g").attr("class", "table").append("circle").attr("class", "center-table")
            .attr("r", xAxisScale(0.7))
            .attr("cx", xAxisScale(1.778))
            .attr("cy", yAxisScale(2.2))
            .style("fill", "#c8c6c0")
            .style("opacity", 0.2);

      var toilet = innerSpace.append("g").attr("class", "toilet").append("rect")
            .attr("class", "toilet-svg")
            .attr("x", xAxisScale(0.2))
            .attr("y", yAxisScale(4))
            .attr("width", toiletSize)
            .attr("height", toiletSize)
            .style("fill", "gray")
            .style("opacity", 0.5);
      furnitureUtils.defineFurniture(svgDefs, toiletSize, "toilet-piece", toiletImg, [14, 0])
      furnitureUtils.placeFurniture(toilet, "toilet-piece")

      var bed = innerSpace.append("g").attr("class", "bed").append("rect")
            .attr("class", "bed-svg")
            .attr("x", xAxisScale(2.2))
            .attr("y", yAxisScale(1.5))
            .attr("width", 150)
            .attr("height", 150)
            .style("fill", "gray")
            .style("opacity", 0.5)
      furnitureUtils.defineFurniture(svgDefs, bedSize, "bed-piece", bedImg, [-10, -5])
      furnitureUtils.placeFurniture(bed, "bed-piece")

      var doors = innerSpace.append("g").attr("class", "door")

      doors.append("line").attr("class", "door1")
      .attr("x1", xAxisScale(3.45))
      .attr("y1", yAxisScale(0.0))
      .attr('x2', xAxisScale(3.45))
      .attr("y2", yAxisScale(1.31))
      .style("opacity", 0.4)
      .style("stroke-width", "10px")
      .style("stroke", "gray");

      doors.append("line").attr("class", "door1")
      .attr("x1", xAxisScale(3.45))
      .attr("y1", yAxisScale(2.69))
      .attr('x2', xAxisScale(3.45))
      .attr("y2", yAxisScale(4.0))
      .style("opacity", 0.4)
      .style("stroke-width", "10px")
      .style("stroke", "gray");

      // Initialize Locations Dot Container
      locationContainer = innerSpace.append("g").attr("class", "locations");
      // Initialize hovercard
      hovercard = d3.select("body").append("div").attr("class", "hovercard")
      .style("visibility", "hidden");
      // Initialize name selection
      nameContainer = innerSpace.append("g").attr("class", "names");
      // Initialize coordinate selection
      coordinateContainer = innerSpace.append("g").attr("class", "coordinates");
    },
    onMessage(topic, msg) {
      if (topic === locationTopic) {
        this.handlePositionRequest(msg)
      }
    },
    //This function get postion data and process it
    handlePositionRequest(msg) {
      var payload;
      try {
        payload = JSON.parse(msg);
      } catch (e) {
        console.log(e);
      }
      var x = +payload.x;
      // console.log("x coordinate", x);
      var y = +payload.y;
      var name = payload.name;
      var newData = {x: x, y: y, name: name};
      // *************************************
      // Important debug print
      // console.log("Position data is: ", newData);
      this.update(newData);
    },
    update(data) {
      var positionData = [];
      if (locationContainer.select("\." + data.name + "Location")[0] == '') {
        positionData.push(data);
        this.createPositionDot(positionData);
        this.createName(positionData);
        this.createCoordinate(positionData);
      } else if (locationContainer.select("\." + data.name + "Location")) {
        positionData.push(data)
        this.updateLocationDot(positionData);
        this.updateName(positionData);
        this.updateCoordinate(positionData);
      }
    },
    updateTime(data) {
      d3.select("body").select(".container").select(".row-log").select(".time").select("#time-elapsed").text(data);
    },
    createPositionDot(data) {
      var locationSelection = locationContainer.append("g").attr("class", data[0].name + "Location")
      .selectAll("location").data(data).enter().append("circle").style("opacity", 0.85);

      var locationAttribute = locationSelection
      .attr("id", function(d) { return d.name + "Location"})
      .attr("r",  50)
      .attr("cx", function(d, i) { return xAxisScale(d.x); })
      .attr("cy", function(d, i) { return yAxisScale(d.y); })
      .attr("stroke", function(d, i) { return color(d.name); })
      .style("fill", function(d, i) { return color(d.name); });
    },
    createName(data) {
      var nameSelection = nameContainer.append("g").attr("class", data[0].name + "Name")
      .selectAll("name").data(data).enter().append("text").style("opacity", 0.85);

      var nameAttribute = nameSelection
      .attr("id", function(d) { return d.name + "Name"; })
      .attr("x", function(d, i) { return xAxisScale(d.x) + 40; })
      .attr("y", function(d, i) { return yAxisScale(d.y) - 20; })
      .text(function(d, i) { return d.name.toUpperCase(); })
      .style("fill", "black")
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
    },
    createCoordinate(data) {
      var coordinateSelection = coordinateContainer
      .append("g").attr("class", data[0].name + "Coordinate")
      .selectAll("coordinate").data(data).enter().append("text")
      .style("opacity", 0.85);

      var coordinateAttribute = coordinateSelection
      .attr("id", function(d) { return d.name + "Coordinate"; })
      .attr("x", function(d, i) { return xAxisScale(d.x) + 40; })
      .attr("y", function(d, i) { return yAxisScale(d.y) + 5; })
      .text(function(d, i) { return "(" + d.x + ", " + d.y + ")"; })
      .style("fill", "black")
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
    },
    updateLocationDot(data) {
      var locationSelection = locationContainer.select("#" + data[0].name + "Location");

      var locationDataUpdate = locationSelection.data(data, function(d, i) { return d.name});

      locationSelection
      .transition().duration(400)
      .attr("cx", function(d) { return xAxisScale(d.x); })
      .attr("cy", function(d) { return yAxisScale(d.y); });
    },
    updateName(data) {
      var nameSelection = nameContainer.select("#" + data[0].name + "Name");
      nameSelection.transition().duration(transitionTime)
      .attr("x", function(d, i) { return xAxisScale(data[0].x) + 40; })
      .attr("y", function(d, i) { return yAxisScale(data[0].y) - 20; })
    },
    updateCoordinate(data) {
      var coordinateSelection = coordinateContainer.select("#" + data[0].name + "Coordinate");

      var coordinateDataUpdate = coordinateSelection.data(data, function(d, i) { return d.name});

      coordinateSelection
      .transition().duration(transitionTime)
      .attr("x", function(d) { return xAxisScale(d.x) + 40; })
      .attr("y", function(d) { return yAxisScale(d.y) + 5; })
      .text(function(d, i) { return "(" + d.x + ", " + d.y + ")"; })
    },
    removeClass(data) {
      data.remove();
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .svg-location-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    vertical-align: top;
    overflow: hidden;
    background: url(../../assets/images/furniture/N_2.png);
    background-size: contain;
    background-repeat: no-repeat;
  }


  .svg-location-content {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
  }

  .locations circle {
    stroke-width: 2px;
  }

  .table {
    stroke-width: 4px;
    stroke: #777;
  }

  .plant {
    stroke-width: 2px;
    stroke: green;
  }

  .door1 {
    stroke-width: 10px;
    stroke: gray;
  }

  .hovercard {
    position: absolute;
    max-width: 400px;
    height: auto;
    padding: 5px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
    pointer-events: none; /* MUY IMPORTANTE! */
    z-index: 10;
    font-family: sans-serif;
    font-size:12px;
    color: orange;
    background-color: lightblue;
  }
</style>
