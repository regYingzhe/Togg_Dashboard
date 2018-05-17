<template lang="html">
  <div class="">
    <!-- <h2 class="intensity-indicator">Loading Intensity Data</h2> -->
    <div id="intensity-container" class="svg-intensity-container">
    </div>
  </div>
</template>

<script>
import * as mqttClient from "./../../util_modules/mqtt.js"
var d3 = require("d3");
import jsonConfig from "../../config/config.json";
import chartStyle from "../../config/4MChartStyleConfig.js";
// console.log("topic config is ", jsonConfig);
var intensityTopic = jsonConfig.intensityTopic;
// console.log("intensityTopic is", intensityTopic);
// var tsv = require("../../data/duration.tsv");
//Initilization
var svgViewPort;
var margin = {top: 20, right: 40, bottom: 20, left: 55};
// Define the aspect ratio
var outterWidth = 550;
var outterHeight = 550;
var width = outterWidth - margin.left - margin.right;
var height = outterHeight - margin.top - margin.bottom;
var innerSpace;
var parseDate;
var xAxisScale;
var yAxisScale;
var xAxis;
var yAxis;
var xAxisGroup;
var yAxisGroup;
var dataContainer;
var areaContainer;
var legendContainer;

var axisSignal = 0;
var dotRadius = 2;
var line;
var path;
var dot;
var area;
var data = [];
var maxNumberOfRecords = 50;
var breathingThres = 0.0025;
var maxBelowBreathingThres = 0.003;
var maxAboveBreathingThres = 0.012;
var testingMaxYValue  = 0.005;
var inputData = [{"color": "#8BC4EB", "name": "Intensity", "opacity": 0.65}];

var testingMode = false;
var dotAttribute = 0;
var areaStyleSignal = 0;
var axisAttribute = 0;

var createGraph;
var path;
var areaPath;
var smoothLine;
var lineArea;
var barG;

var endTimeViewport;
var startTime;
var timeInterval;
var maxSeconds = 300;
var pixelsPerSecond = 10;
var barID = 0;
var color;
var colorIndex = -1;
var timerID;
var areaFirstTime = true;

export default {
  mounted() {
    this.createSVG();
    mqttClient.connect(intensityTopic);
    mqttClient.sub();
    mqttClient.setOnMessage(this.onMessage);
    data = [];
    // uncomment this and update data function to restore back to original
    // this.drawIntensityGraph();
    this.drawIntensityGraphTest(timeInterval)
  },
  beforeDestory() {
    mqttClient.endConnection();
    data = [];
    // clearTimeout(creatGraph);
    clearInterval(timerID);
  },
  methods: {
    createSVG() {
      svgViewPort = d3.select("div#intensity-container").append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + outterWidth + " " + outterHeight)
      .classed("svg-intensity-content", true);

      innerSpace = svgViewPort.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      color = d3.scale.category10();
      // parses the specified string and returning the corresponding date object
      parseDate = d3.time.format("%d-%b-%y").parse;
      path = innerSpace.append("path");
      areaPath = innerSpace.append("path");

      // define clip-path
      innerSpace.append("defs").append("clipPath").attr("id", "myClip")
      .append("rect").attr("x", 0).attr("y", 0).attr("width", width)
      .attr("height", height);

      barG = innerSpace.append("g")
      .attr("class", "barGroup")
      .attr("transform", "translate(0, 0)")
      .attr("clip-path", "url(#myClip")
      .append("g");

      endTimeViewport = new Date();
      console.log(endTimeViewport);
      startTime = new Date(endTimeViewport.getTime() - width / pixelsPerSecond * 1000);
      timeInterval = [startTime, endTimeViewport];

      xAxisScale = d3.time.scale().range([0, width]).domain(timeInterval);

      yAxisScale = d3.scale.linear().range([height, 0]).domain([0, testingMaxYValue]);


      xAxis = d3.svg.axis().scale(xAxisScale).orient("bottom");
      yAxis = d3.svg.axis().scale(yAxisScale).orient("left");

      // Initilize Axis
      this.drawingAxis();

      dataContainer = innerSpace.append("g").attr("class", "dataEntries");
      areaContainer = innerSpace.append("g").attr("class", "intensity");
      legendContainer = innerSpace.append("g").attr("class", "legendContainer");
    },

    onMessage(topic, msg) {
      if (topic === intensityTopic) {
        this.handleMovementRequest(msg);
      }
    },

    handleMovementRequest(msg) {
      var payload;
      var newData;
      try {
          payload = JSON.parse(msg);

          // console.log("Data Received: ", payload);
          var intensity = payload.intensity;
          var time = new Date();
          // newData = { value: intensity, date: time, color: color(colorIndex % 10), opacity: Math.max(Math.random(), 0.3), size: Math.max(Math.round(Math.random() * 12), 4)};
          newData = { value: intensity, date: time, color: color(colorIndex % 10), opacity: Math.max(Math.random(), 0.3), size: 5};
          // ******************************
          console.log("Intensity data is: ", newData);
      } catch (e) {
          console.log(e);
      }
      this.update(newData);
    },

    update(newData) {
      // Append new data
			// data = data.concat(newData);
			// Remove old data (i.e., avoid overflows)
			// while (data.length > maxNumberOfRecords) {
			// 	delete data.shift();
			// }
      // var drawIntensityGraph = setTimeout(function() {
      //   alert("Hello");
      // }, 3000);
      data.push(newData);
      // this.refresh();
		},
    refresh() {
      data = data.filter(function(d) {
        if (d.date.getTime() > startTime.getTime()) {
          return true;
        }
      })
      // var updateSel = barG.selectAll(".bar").data(data);
      // updateSel.exit().remove();
      // updateSel.enter().append(function(d) {
      //   var node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      //   return node;
      // })
      // .attr("class", "bar")
      // .attr("id", function() {
      //   return "bar-" + barID++;
      // });
      //
      // updateSel.attr("cx", function(d) {
      //   return Math.round(xAxisScale(d.date));
      // })
      // .attr("cy", function(d) {
      //   return yAxisScale(d.value);
      // })
      // .attr("r", function(d) { return d.size / 2; })
      // .style("fill", function(d) { return d.color })
      // .style("fill-opacity", function(d) { return d.opacity; });

      // Plan Two
      if (areaFirstTime) {
        this.drawingArea(data);
        areaFirstTime = false;
      } else {
        // this.removePrevArea();
        // this.drawingArea(data);
        d3.select("path.intensity_area").data([data]).transition().ease("linear")
        .attr("d", area)
        // .style("fill", "#8BC4EB")
        // .style("opacity", 1);
      }
      // if (areaFirstTime) {
      //   barG.append("path").attr("class", "intensity_area")
      //   .attr("d", this.createArea(data))
      //   .style("fill", "#8BC4EB").style("opacity", 0.65)
      //   .transition().duration(200)
      //   .attr("d", this.createArea(data, 'value'));
      //   areaFirstTime = false;
      // } else {
      //
      // }



    },
    // This function moves the graph.
    drawIntensityGraphTest: function(timeInterval) {
      var that = this;
      var timerID = setInterval(function() {
        var interval = timeInterval[1].getTime() - timeInterval[0].getTime();
        var endTime = new Date();
        var startTimeViewport = new Date(endTime.getTime() - interval);
        var newtimeInterval = [startTimeViewport, endTime];
        timeInterval = newtimeInterval;
        that.updateAxisTest(newtimeInterval);
        that.refresh();
      }, 260)
    },
    updateAxisTest(newtimeInterval) {
      xAxisScale.domain(newtimeInterval);
      xAxis.scale(xAxisScale);
      d3.select(".intensity_x_axis").transition()
      .duration(200)
      .ease("linear")
      .call(xAxis);

      if (!testingMode) {
        var ymax1 = d3.max(d3.extent(data, function(d) { return d.value; }));
        if (ymax1 <= breathingThres) {
          yAxisScale.domain([0, maxBelowBreathingThres]);
          yAxis.scale(yAxisScale);
        } else {
          yAxisScale.domain([0, ymax1]);
          yAxis.scale(yAxisScale);
        }
        d3.select(".intensity_y_axis").transition()
        .ease("linear")
        .duration(200)
        .call(yAxis);
      }

      area = d3.svg.area().interpolate("monotone")
        .x(function(d) { return xAxisScale(d.date); })
        .y1(function(d) { return yAxisScale(d.value); })
        .y0(height);

    },
    createArea(datum, field) {
      var areaFunc = d3.svg.area().interpolate("monotone")
        .x(function(d) { return xAxisScale(d.date); })
        .y0(height)
        .y1(function(d) {
            return yAxisScale(d[field] || 0);
          })(datum);
      return areaFunc;
    },
    drawIntensityGraph: function() {
      var that = this;
      setInterval( () => {
        // console.log("hello");
        if (data.length == maxNumberOfRecords) {
          // Convert value string into int
          // console.log("Reached max number of records");
          that.createLegend(inputData);
          d3.select(".intensity-indicator").style("display", "none");
          data.forEach(function(d) {
            d.value = +d.value;
          });
          // Update xAxis domain
          xAxisScale.domain(d3.extent(data, function(d) {
            return d.date;
          }));
          xAxis.scale(xAxisScale);

          if (!testingMode) {
            var ymax1 = d3.max(d3.extent(data, function(d) { return d.value; }));
            if (ymax1 <= breathingThres) {
              yAxisScale.domain([0, maxBelowBreathingThres]);
              yAxis.scale(yAxisScale);
            } else {
              yAxisScale.domain([0, ymax1]);
              yAxis.scale(yAxisScale);
            }
          }
          // Create line generator function, telling d3 how to grab the data and interpolate drawing the line
          area = d3.svg.area().interpolate("monotone")
            .x(function(d) { return xAxisScale(d.date); })
            .y1(function(d) { return yAxisScale(d.value); })
            .y0(height);
          // First time to draw the line
          if (axisSignal == 0) {
            axisSignal = 1;
            that.drawingAxis();
            that.drawingDot(data);
            that.drawingArea(data);
          } else {
            that.updatexAxis();
            that.removePrevArea();
            that.updateDrawingDot(data);
            that.drawingArea(data);
          }
        } else if (data.length < maxNumberOfRecords) {
          d3.select(".intensity-indicator").style("display", "inline");
        }
      }, 100)
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
      var xAxisGroup = innerSpace.append("g").attr("class", "intensity_x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      var yAxisGroup = innerSpace.append("g").attr("class", "intensity_y_axis")
        .call(yAxis);

      if (!axisAttribute) {
        xAxisGroup.style("fill", "none")
        .style("stroke", chartStyle.xAxisText.fill)
        .style("shape-rendering", "crispEdges")
        .style("stroke-width", "1.0px")
        .style("opacity", 0.7);

        yAxisGroup.style("fill", "none")
        .style("stroke", chartStyle.xAxisText.fill)
        .style("shape-rendering", "crispEdges")
        .style("stroke-width", "1.0px")
        .style("opacity", 0.7);

        var yAxisText = yAxisGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("x", -10)
        .attr("dy", chartStyle.yAxisText.dy)
        .text("Intensity")
        .style("text-anchor", chartStyle.yAxisText.textAncor)
        .style("stroke", chartStyle.xAxisText.fill)
        .style("font-size", chartStyle.yAxisText.fontSize)
        .style("fill", chartStyle.yAxisText.fill)


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
      // path = areaContainer.append("path").attr("class", "intensity_area")
      //       .datum(data)
      //       .attr("d", area);
      path = barG.append("path").attr("class", "intensity_area")
            .datum(data)
            .attr("d", area);
      path.style("fill", "#8BC4EB").style("opacity", 0.65)
    },

    updatexAxis() {
      d3.select(".intensity_x_axis").transition().call(xAxis);
      d3.select(".intensity_y_aixs").transition().call(yAxis);
    },

    removePrevArea() {
      d3.select(".intensity_area").remove();
    },

    updateDrawingDot(data) {
      var dotUpdate = dot.data(data);
      var dotUpdateAttribute = dotUpdate.attr("cx", function(d) { return xAxisScale(d.date)})
      .attr("cy", function(d) { return yAxisScale(d.value)});
    },
  }
}
</script>

<style scoped>

  .tick {
    opacity: 0.5;
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

  .svg-intensity-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    vertical-align: top;
    overflow: hidden;
  }

  .svg-intensity-content {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
