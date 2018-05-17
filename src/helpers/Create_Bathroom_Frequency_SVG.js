// var exports = module.exports = {}
var d3 = require("d3")
var BathroomFrequencyCSV = require("../data/Bathroom_Frequency.csv");

var margin = {top: 20, right: 40, bottom: 30, left: 40};
var outterWidth = 550;
var outterHeight = 550;
var width = outterWidth - margin.left - margin.right;
var height = outterHeight - margin.top - margin.bottom;
var svg;
var innerSpace;
var parseDate
var xAxisScale;
var yAxisScale;
var line;
var xAxis;
var yAxis;
var dataContainer;
var areaContainer;
var legendContainer;
var locationFrequencyData;
var parsingSignal = true;
var locationName = "Bathroom_Frequency";

var color = d3.scale.ordinal().range(["#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC"]);

module.exports = {
  CreateBathroomFrequencySVG: function () {
    svg = d3.select("div#visit-restroom-container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + outterWidth + " " + outterHeight)
    .classed("svg-visit-restroom-content", true);

    innerSpace = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    parseDate = d3.time.format("%Y%m%d");
    xAxisScale = d3.time.scale().range([0, width]);
    yAxisScale = d3.scale.linear().range([height, 0]);


    // color.domain(d3.map())
    color.domain(d3.keys(BathroomFrequencyCSV[0]).filter(function(d) {
      return d !== "date";
    }))

    do {
      BathroomFrequencyCSV.forEach(function(d) {
        d.date = parseDate.parse(d.date + "");
      })
      parsingSignal = false;
    } while (parsingSignal)

    if (!parsingSignal) {
      locationFrequencyData = color.domain().map(function(name) {
        return {
          name: name,
          values: BathroomFrequencyCSV.map(function(d) {
            return {
              date: d.date,
              Frequency: +d[name]
            }
          })
        }
      })
      parsingSignal = true;
    }

    console.log("locationFrequencyData date is ", locationFrequencyData[0].values[0].date);
    this.setAxisScale(xAxisScale, yAxisScale);
    this.setLine();
    this.setAxisDomain(xAxisScale, yAxisScale, BathroomFrequencyCSV);
    this.createGraphxAxis(innerSpace);
    this.createGraphyAxis(innerSpace);
    this.drawLine(innerSpace)
  },
  setAxisScale: function(xAxisScale, yAxisScale) {
    xAxis = d3.svg.axis().scale(xAxisScale).orient("bottom")
    .ticks(5);
    yAxis = d3.svg.axis().scale(yAxisScale).orient("left");
  },
  setLine: function() {
    line = d3.svg.line().interpolate("basic")
    .x(function(d) { return xAxisScale(d.date); })
    .y(function(d) { return yAxisScale(d.Frequency); })
    .defined(function(d) { return d.Frequency; })
  },
  setAxisDomain: function(xAxisScale, yAxisScale, data) {
    xAxisScale.domain(d3.extent(data, function(d) {
      return d.date;
    }))

    console.log("xAxis domain is", xAxisScale.domain())
    yAxisScale.domain(d3.extent(data, function(d) {
      return d[locationName];
    }))
    console.log("yAxis domain is", yAxisScale.domain())
  },
  createGraphxAxis: function(svg) {
    var BathroomFrequencyxAxis = svg.append("g").attr("class", "BathroomFrequencyxAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    BathroomFrequencyxAxis.style("fill", "none")
    .style("stroke", "#1E1E1F")
    .style("shape-rendering", "crispEdges")
    .style("stroke-width", "1.0px")
    // This is how you select text of the axis
    // console.log(d3.selectAll(".x.axis g.tick text"))
    d3.selectAll(".BathroomFrequencyxAxis g.tick text")
    .style("fill", "#1E1E1F")
    .style("font-size", "13px")
    // .style("text-anchor", "end")
    // .attr("dx", "-.8em")
    // .attr("dy", ".15em")
    // .attr("transform", "rotate(-65)")
  },
  createGraphyAxis: function(svg) {
    var BathroomFrequencyyAxis = svg.append("g").attr("class", "BathroomFrequencyyAxis")
    .call(yAxis);

    BathroomFrequencyyAxis.style("fill", "none")
    .style("stroke", "#1E1E1F")
    .style("shape-rendering", "crispEdges")
    .style("stroke-width", "1.0px")
    // This is how you select text of the axis
    // console.log(d3.selectAll(".x.axis g.tick text"))
    d3.selectAll(".BathroomFrequencyyAxis g.tick text")
    .style("fill", "#1E1E1F")
    .style("font-size", "15px")

    BathroomFrequencyyAxis.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("x", -10)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency (hours)")
    .style("stroke", "#1E1E1F")
    .style("font-size", "13px")
    .style("fill", "#1E1E1F")
  },
  drawLine: function(svg) {
    var BathroomFrequencyLine = svg.selectAll(".BathroomFrequencyFrequency")
    .data(locationFrequencyData).enter().append("g")
    .attr("class", ".BathroomSleppFrequency")

    BathroomFrequencyLine.append("path")
    .attr("class", "BathroomFrequencyFrequencyLine")
    .attr("d", function(d) { return line(d.values); })
    .style("fill", "none")
    .style("stroke", function(d) { return color(d.name); })
  }
}
