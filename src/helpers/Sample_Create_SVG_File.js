// var exports = module.exports = {}
var d3 = require("d3")
var csv = require("../data/Bathroom_Duration.csv");

var margin = {top: 20, right: 30, bottom: 20, left: 30};
var outterWidth = 550;
var outterHeight = 550;
var width = outterWidth - margin.left - margin.right;
var height = outterHeight - margin.top - margin.bottom;
var svg;
var innerSpace;
var parseDate
var xAxisScale;
var yAxisScale;
var xAxis;
var yAxis;
var dataContainer;
var areaContainer;
var legendContainer;

var color = d3.scale.ordinal().range(["#48A36D", "#56AE7C", "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", "#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"]);

module.exports = {
  CreateBathroomDurationSVG: function () {
    svg = d3.select("div#sleep-time-container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + outterWidth + " " + outterHeight)
    .classed("svg-sleep-time-content", true);

    innerSpace = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    parseDate = d3.time.format("%Y%m%d");
    xAxisScale = d3.time.scale().range([0, width]);
    yAxisScale = d3.scale.linear().range([height, 0]);

    this.setAxisScale(xAxisScale, yAxisScale)
    this.setLine()
    this.setAxisDomain()
  },
  setAxisScale: function(xAxisScale, yAxisScale) {

  },
  setLine: function() {

  },
  setAxisDomain: function() {

  }


}
