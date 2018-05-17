<template lang="html">
  <div class="">
    <h2 class="speed-indicator">Loading Speed Data</h2>
    <div id="speed-container" class="svg-speed-container">
    </div>
  </div>
</template>

<script>
import * as mqttClient from "./../../util_modules/mqtt.js";
var d3 = require('d3');
import jsonConfig from "../../config/config.json";
// console.log("topic config is ", jsonConfig);
var speedTopic = jsonConfig.speedTopic;
console.log("speedTopic is", speedTopic);

var dotRadius = 2;
var svgViewPort;
var data = [];
var margin = {top: 20, right: 30, bottom: 20, left: 30};
var outterWidth = 550;
var outterHeight = 550;
var width = outterWidth - margin.left - margin.right;
var height = outterHeight - margin.top - margin.bottom;
var innerSpace;
var xAxisScale;
var yAxisScale;
var xAxis;
var yAxis;
var dataContainer;
var areaContainer;
var legendContainer;
// parses the specified string and returning the corresponding date object

var axisSignal = 0
var line;
var path;
var dot;
var graphStyle;
var maxNumberOfRecords = 50;
var interpolation = "monotone";
var chartStyle = "line";
var inputData = [{"color": "#8BC4EB", "name": "Speed", "opacity": 0.65}];

var testingMode = true;
var dotAttribute = 0;
var areaStyleSignal = 0;
var axisAttribute = 0;

export default {
  mounted() {
    this.createSVG()
    mqttClient.connect([speedTopic]);
    mqttClient.sub()
    mqttClient.setOnMessage(this.onMessage);

  },
  beforeDestory() {
    mqttClient.endConnection();
    data = [];
  },
  methods: {
    createSVG() {
      // svgViewPort = d3.select("#speed-svg").attr("width", 1062).attr("height", 500);
      svgViewPort = d3.select("div#speed-container").append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + outterWidth + " " + outterHeight)
      .classed("svg-speed-content", true);
      innerSpace = svgViewPort.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      xAxisScale = d3.time.scale().range([0, width]);
      yAxisScale = d3.scale.linear().range([height, 0]).domain([0,5]);

      xAxis = d3.svg.axis().scale(xAxisScale).orient("bottom");
      yAxis = d3.svg.axis().scale(yAxisScale).orient("left");

      dataContainer = innerSpace.append("g").attr("class", "dataEntries");
      areaContainer = innerSpace.append("g").attr("class", "intensity");

      legendContainer = innerSpace.append("g").attr("class", "legendContainer");
    },
    onMessage(topic, msg) {
      if (topic === speedTopic) {
        this.handleSpeedRequest(msg);
      }
    },
    handleSpeedRequest(msg) {
      var payload;
      var speedData;
      try {
        var payload = JSON.parse(msg);
        var speedValue = payload.speed;
        var time = new Date();
        var speedData = { value: speedValue, date: time};
        // console.log("I got speedData: ", speedData);
      } catch (e) {
          console.log(e);
      }
      this.update(speedData);
    },
    update(newData) {
      // Append new data
      data = data.concat(newData);

      // Remove old data (i.e., avoid overflows)
      while (data.length > maxNumberOfRecords) {
        delete data.shift();
      }

      if (data.length == maxNumberOfRecords) {
        // Convert value string into int
        this.createLegend(inputData);
        d3.select(".speed-indicator").style("display", "none");
        data.forEach(function(d) {
          d.value = +d.value;
        });

        // Update xAxis domain
        xAxisScale.domain(d3.extent(data, function(d) {
          return d.date;
        }));

        // Set xAxis scale
        xAxis.scale(xAxisScale);

        // Set graph style
        this.graphStyleGenerator(interpolation, chartStyle);

        // First time to draw the line
        if (axisSignal == 0) {
          axisSignal = 1;
          this.drawingAxis();
          this.drawingDot(data);
          this.drawingArea(data);
        } else {
          this.updatexAxis();
          this.removePrevLine();
          this.updateDrawingDot(data);
          this.drawingArea(data);
        }
      } else if (data.length < maxNumberOfRecords) {
        d3.select(".speed-indicator").style("display", "inline");
      }
    },
    graphStyleGenerator(interpolation, chartStyle) {
      if (chartStyle === "area") {
        graphStyle = d3.svg.area().interpolate(interpolation)
          .x(function(d) { return xAxisScale(d.date); })
          .y1(function(d) { return yAxisScale(d.value); })
          .y0(height);
      } else if (chartStyle === "line") {
        graphStyle = d3.svg.line().interpolate(interpolation)
          .x(function(d) { return xAxisScale(d.date); })
          .y(function(d) { return yAxisScale(d.value); })
      }
    },
    createLegend(inputData) {
      var legend = legendContainer.selectAll(".legend")
        .data(inputData)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 25 + ")"; })

        legend.append("circle")
        .attr("r", 10)
        .attr("cx", width - 18)
        .style("fill", function(d) { return d.color; })
        .style("opacity", function(d) { return d.opacity; })

        legend.append("text")
        .attr("x", width - 35)
        .attr("y", 0)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.name});
    },
    drawingAxis() {
      var xAxisGroup = innerSpace.append("g").attr("class", "speed_x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      var yAxisGroup = innerSpace.append("g").attr("class", "speed_y_axis")
        .call(yAxis)

        if (!axisAttribute) {
          xAxisGroup.style("fill", "none")
          .style("stroke", "#EEEEEE")
          .style("shape-rendering", "crispEdges")
          .style("stroke-width", "1.0px")
          .style("opacity", 0.9);

          yAxisGroup.style("fill", "none")
          .style("stroke", "#EEEEEE")
          .style("shape-rendering", "crispEdges")
          .style("stroke-width", "1.0px")
          .style("opacity", 0.9)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .style("text-anchor", "end")
          .text("Speed: m/s");;
          axisAttribute = 1;
        }
    },
    drawingDot(data) {
      dot = dataContainer.selectAll("circle").data(data).enter().append("circle").attr("class", "circle1");
      if (!dotAttribute) {
        dotAttribute = dot.attr("r", dotRadius).attr("cx", function(d) { return xAxisScale(d.date)})
          .attr("cy", function(d) { return yAxisScale(d.value)})
          .style("fill", "#8BC4EB")
          .style("opacity", 0.65);
      }
    },
    drawingArea(data) {
      path = areaContainer.append("path").attr("class", "speed_path")
        .datum(data)
        .attr("d", graphStyle)
        .style("fill", "none")
        .style("stroke", "#8BC4EB");
    },
    updatexAxis() {
      d3.select(".speed_x_axis").transition().call(xAxis);
    },
    removePrevLine() {
      d3.select(".speed_path").remove();
    },
    updateDrawingDot(data) {
      var dotUpdate = dot.data(data);
      var dotUpdateAttribute = dotUpdate.attr("cx", function(d) { return xAxisScale(d.date)})
      .attr("cy", function(d) { return yAxisScale(d.value)});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  body {
    font-family: 'Source Sans Pro';
    font-weight: lighter;
    font-size: 10px;
    margin-top: 0.25em;
    width: 100%;
    height: 100%;
  }
  .axis path,
  .axis line{
    fill: none;
    stroke: #EEEEEE;
    shape-rendering: crispEdges;
    stroke-width: 1.0px;
    opacity: 0.5;
  }

  .line {
    fill: none;
    stroke: #8cb6de;
    stroke-width: 1.5px;
  }

  .tick {
    opacity: 0.5;
  }

  .svg-speed-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    vertical-align: top;
    overflow: hidden;
  }

  .svg-speed-content {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
  }

  text {
    font-family: 'Source Sans Pro';
    font-weight: lighter;
    font-size: 10px;
    margin-top: 0.25em;
    color: #f20909;
    width: 100%;
    height: 100%;
    opacity: 0.5;
  }

  /* .area {
    fill: #8BC4EB;
    opacity: 0.65;
    stroke: #80ADD9;
  } */


  /* .circle1 {
    stroke: #005BB3;
    fill: #8BC4EB;
    opacity: 0.65;
  } */

  /* .circle2 {
    fill: #76D0A0;
    opacity: 0.1;

  } */
</style>
