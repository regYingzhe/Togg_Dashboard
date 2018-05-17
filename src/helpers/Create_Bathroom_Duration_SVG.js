// var exports = module.exports = {}
var d3 = require("d3")
var BathroomDurationCSV = require("../data/Bathroom_Duration.csv");

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
var locationDurationData;
var parsingSignal = true;
var locationName = "Bathroom";
var avgLine;
var normalBathDuration = 15;
var avgLineData = [{"x": 0, "y": normalBathDuration}, {"x": width, "y": normalBathDuration}];
var bathroomLine;
var color = d3.scale.ordinal().range(["#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC"]);
var BathroomNormalArea;

module.exports = {
  CreateBathroomDurationSVG: function () {
    svg = d3.select("div#toilet-time-container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + outterWidth + " " + outterHeight)
    .classed("svg-toilet-time-content", true);

    innerSpace = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    parseDate = d3.time.format("%Y%m%d");
    xAxisScale = d3.time.scale().range([0, width]);
    yAxisScale = d3.scale.linear().range([height, 0]);

    // color.domain(d3.map())
    color.domain(d3.keys(BathroomDurationCSV[0]).filter(function(d) {
      return d !== "date";
    }))

    do {
      BathroomDurationCSV.forEach(function(d) {
        d.date = parseDate.parse(d.date + "");
      })
      parsingSignal = false;
    } while (parsingSignal)

    if (!parsingSignal) {
      locationDurationData = color.domain().map(function(name) {
        return {
          name: name,
          values: BathroomDurationCSV.map(function(d) {
            return {
              date: d.date,
              duration: +d[name]
            }
          })
        }
      })
      parsingSignal = true;
    }

    console.log("locationDurationData date is ", locationDurationData[0].values[0].date);
    this.setAxisScale(xAxisScale, yAxisScale);
    this.setLine();
    this.setArea();
    this.setAxisDomain(xAxisScale, yAxisScale, BathroomDurationCSV);
    this.createGraphxAxis(innerSpace);
    this.createGraphyAxis(innerSpace);
    this.drawLine(innerSpace);
    this.drawCircle(bathroomLine);
    this.drawArea(innerSpace);
  },
  setAxisScale: function(xAxisScale, yAxisScale) {
    xAxis = d3.svg.axis().scale(xAxisScale).orient("bottom")
    .ticks(5);
    yAxis = d3.svg.axis().scale(yAxisScale).orient("left");
  },
  setLine: function() {
    line = d3.svg.line().interpolate("basic")
    .x(function(d) { return xAxisScale(d.date); })
    .y(function(d) { return yAxisScale(d.duration); })
    .defined(function(d) { return d.duration; })

    avgLine = d3.svg.line().interpolate("basic")
    .x(function(d) { return d.x; })
    .y(function(d) { return yAxisScale(d.y); })
  },
  setArea: function() {
    BathroomNormalArea = d3.svg.area()
    .x(function(d) { return d.x; })
    .y0(height)
    .y1(function(d) { return yAxisScale(d.y); })
  },
  setAxisDomain: function(xAxisScale, yAxisScale, data) {
    xAxisScale.domain(d3.extent(data, function(d) {
      return d.date;
    }))

    // console.log("xAxis domain is", xAxisScale.domain())
    var yMax = d3.max(d3.extent(data, function(d) {
      return d[locationName];
    }));

    var yMin = d3.min(d3.extent(data, function(d) {
      return d[locationName];
    }))

    yAxisScale.domain([yMin - 2, yMax + 2]);
    // console.log("yAxis domain is", yAxisScale.domain())
  },
  createGraphxAxis: function(svg) {
    var BathroomDurationxAxis = svg.append("g").attr("class", "BathroomDurationxAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

    BathroomDurationxAxis.style("fill", "none")
    .style("stroke", "#1E1E1F")
    .style("shape-rendering", "crispEdges")
    .style("stroke-width", "1.0px")
    // This is how you select text of the axis
    // console.log(d3.selectAll(".x.axis g.tick text"))

    d3.selectAll(".BathroomDurationxAxis g.tick text")
    .style("fill", "#1E1E1F")
    .style("font-size", "13px")
    .style("opacity", 0)

    d3.selectAll(".BathroomDurationxAxis path")
    .style("display", "none")


    BathroomDurationxAxis.append("text")
    .attr("x", width)
    .attr("dx", "0.71em")
    .attr("dy", "1.5em")
    .style("text-anchor", "end")
    .text("Passed Eight Days")
    .style("fill", "#1E1E1F")
    .style("font-size", "13px");
  },
  createGraphyAxis: function(svg) {
    var BathroomDurationyAxis = svg.append("g").attr("class", "BathroomDurationyAxis")
    .call(yAxis);

    BathroomDurationyAxis.style("fill", "none")
    .style("stroke", "#1E1E1F")
    .style("shape-rendering", "crispEdges")
    .style("stroke-width", "1.0px")

    // This is how you select text of the axis
    // console.log(d3.selectAll(".x.axis g.tick text"))
    d3.selectAll(".BathroomDurationyAxis g.tick text")
    .style("fill", "#1E1E1F")
    .style("font-size", "15px")

    BathroomDurationyAxis.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("x", -10)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Duration (mins)")
    .style("stroke", "#1E1E1F")
    .style("font-size", "13px")
    .style("fill", "#1E1E1F")
  },
  drawLine: function(svg) {
    bathroomLine = svg.selectAll(".BathroomDuration")
    .data(locationDurationData).enter().append("g")
    .attr("class", "BathroomDuration")

    bathroomLine.append("path")
    .attr("class", "BathroomDurationLine")
    .attr("d", function(d) { return line(d.values); })
    .style("fill", "none")
    .style("stroke", function(d) { return color(d.name); })
    .style("stroke-width", "3px")

    svg.append("path").attr("class", "normalBathroomDurationLine")
    .attr("d", avgLine(avgLineData))
    .style("fill", "none")
    .style("stroke", "steelblue")
    .style("stroke-dasharray", ("3, 3"))
  },
  drawCircle: function(bathroomLine) {
    bathroomLine.style("fill", "#FFF")
    .style("stroke", function(d) { return color(d.name); })
    .selectAll(".tolietCircles")
    .data(function(d) { return d.values; })
    .enter()
    .append("circle")
    .attr("r", 5)
    .style("stroke-width", 3)
    .attr("cx", function(d) { return xAxisScale(d.date); })
    .attr("cy", function(d) { return yAxisScale(d.duration); })
  },
  drawArea: function(svg) {
    svg.append("path")
    .datum(avgLineData)
    .attr("class", "normalSleepArea")
    // .style("fill", "url(#myGradient)")
    .attr("d", BathroomNormalArea)
    .style("opacity", 0.5)
    .style("fill", "lightsteelblue")
  }
}
