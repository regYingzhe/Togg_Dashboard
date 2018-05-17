<template>
  <div class="svgViewPort"></div>
</template>
<script>
export default {
  mounted() {
      console.log("hello");
      var svgViewPort = d3.select(".row:nth-child(5)").select(".widget").select(".widget-body").select(".svgViewPort").append("svg").attr("width", 491).attr("height", 500);

      var width = 491;
      var height = 500;

      // Color binding with different person
      var color = d3.scale.category10();

      // svgViewPort Setup

      var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

      var innerSpace = svgViewPort.append("g").attr("class", "innerSpace").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      var xAxisScale = d3.scale.linear().domain([0, 3.45]).range([0, width]).nice();
      var yAxisScale = d3.scale.linear().domain([0, 4.0]).range([height, 0]);
      var xAxis = d3.svg.axis().scale(xAxisScale).orient("bottom");
      var yAxis = d3.svg.axis().scale(yAxisScale).orient("left");
      var xAxisGroup = innerSpace.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
      var yAxisGroup = innerSpace.append("g").attr("class", "y axis").call(yAxis);
    },
    methods: {
      getScales() {

        return { xAxis, yAxis };
      },
      drawAxis() {

      }
    }
  }
</script>
<style>
</style>
