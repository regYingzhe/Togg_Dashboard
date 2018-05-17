var d3 = require("d3")
var BedroomDurationCSV = require("../data/Bedroom_Duration.csv");
var patternUtils = require("../util_modules/furniture.js");
// var profileImg = require("../assets/images/regi.png")
// console.log(patternUtils.defineFurniture())

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
var locationName = "Bedroom";
var normalSleepDuration = 6;
var normalSleepLineData = [{"x": 0, "y": normalSleepDuration}, {"x": width, "y": normalSleepDuration}];
var normalSleepLine;
var bedroomSleepLine;
var sleepNormalArea;
var imageProfileCircle;
var userActiveSignal = true;
var indicatorContainer;
var presenceCircle;
var activeMinute = 1;
var activeAction = "Entered"


var color = d3.scale.ordinal().range(["#48A36D", "#56AE7C", "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC"]);

module.exports = {
  CreateBedroomDurationSVG: function () {
    svg = d3.select("div#sleep-time-container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + outterWidth + " " + outterHeight)
    .classed("svg-sleep-time-content", true);

    innerSpace = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    parseDate = d3.time.format("%Y%m%d");
    xAxisScale = d3.time.scale().range([0, width]);
    yAxisScale = d3.scale.linear().range([height, 0]);


    // color.domain(d3.map())
    color.domain(d3.keys(BedroomDurationCSV[0]).filter(function(d) {
      return d !== "date";
    }))

    do {
      BedroomDurationCSV.forEach(function(d) {
        d.date = parseDate.parse(d.date + "");
      })
      parsingSignal = false;
    } while (parsingSignal)

    if (!parsingSignal) {
      locationDurationData = color.domain().map(function(name) {
        return {
          name: name,
          values: BedroomDurationCSV.map(function(d) {
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
    // this.createGradientDef();
    // this.createIndicatorBoundary(innerSpace);
    // this.createImageProfileBoundary(innerSpace);
    // this.createProfilePresenceIndicator(indicatorContainer);
    // this.createIndicatorText(indicatorContainer);
    this.setAxisScale(xAxisScale, yAxisScale);
    this.setLine();
    this.setArea();
    this.setAxisDomain(xAxisScale, yAxisScale, BedroomDurationCSV);
    this.createGraphxAxis(innerSpace);
    this.createGraphyAxis(innerSpace);
    this.drawArea(innerSpace);
    this.drawLine(innerSpace);
    this.drawCircle(innerSpace, bedroomSleepLine);
    // patternUtils.defineProfilePattern(innerSpace, 1, "profilePhoto", profileImg);
    // patternUtils.placeProfilePhoto(imageProfileCircle, "profilePhoto");
  },
  createGradientDef: function() {
    var colorGradient = svg.append("def").append("linearGradient")
    .attr('gradientUnits', 'userSpaceOnUse').attr("id", "myGradient").attr("x1", 0).attr("y1", yAxisScale(50)).attr("x2", 0)
    .attr("y2", yAxisScale(60)).append("stop").attr("offset", "5%")
    .attr("stop-color", "green");

    d3.select("#myGradient").append("stop").attr("offset", "95%")
    .attr("stop-color", "gold")
  },
  createIndicatorBoundary: function(svg) {
    indicatorContainer = svg.append("svg")
    .attr("class", "indicatorBoundary")
    .attr("x", 135).attr("y", 5)
    .attr("width", 200).attr("height", 100)
    .attr("viewBox", "0 0 200 100")
    .style("overflow", "visible")
  },
  createImageProfileBoundary: function(svg) {
    imageProfileCircle = indicatorContainer.append("circle")
    .attr("id", "userProfilePhoto")
    .attr("r", 45)
    .attr("cx", 50)
    .attr("cy", 50)
    .style("fill", "#c8c6c0")
    .style("opacity", 1)
  },
  createProfilePresenceIndicator: function(indicatorContainer) {
    presenceCircle = indicatorContainer.append("circle")
    .attr("id", "presenceCircleIndicator")
    .attr("r", 20)
    .attr("cx", 75)
    .attr("cy", 75)
    .style("opacity", 0.8)
    .style("fill", "white");
  },
  createIndicatorText: function(indicatorContainer) {
    // First line telling about time
    indicatorContainer.append("text").attr("class", "actionTime")
    .attr("x", 110).attr("y", 35)
    .text(activeMinute + " min ago")
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("font-family", "sans-serif");

    // var activeStatusText = indicatorContainer.append("text")
    // .attr("class", "presenceStatus")
    // .attr("x", 110)
    // .attr("y", 55)
    // .attr("font-size", "20px")
    // .attr("fill", "black")
    // .attr("font-family", "sans-serif");

    // Second Line
    var actionLocation = indicatorContainer.append("text").attr("class", "actionLocation")
    .attr("x", 110).attr("y", 75)
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("font-family", "sans-serif");

    actionLocation
    .text(activeAction + " " + locationName)
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

    normalSleepLine = d3.svg.line().interpolate("basic")
    .x(function(d) { return d.x; })
    .y(function(d) { return yAxisScale(d.y); })
  },
  setArea: function() {
    sleepNormalArea = d3.svg.area()
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
    var bedroomDurationxAxis = svg.append("g").attr("class", "bedroomDurationxAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    bedroomDurationxAxis.style("fill", "none")
    .style("stroke", "#1E1E1F")
    .style("shape-rendering", "crispEdges")
    .style("stroke-width", "1.0px")
    // This is how you select text of the axis
    // console.log(d3.selectAll(".x.axis g.tick text"))
    d3.selectAll(".bedroomDurationxAxis g.tick text")
    .style("fill", "#1E1E1F")
    .style("font-size", "13px")
    .style("opacity", 0)
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)")
    // d3.selectAll(".bedroomDurationxAxis g.tick")
    // .style("opacity", 0)

    d3.selectAll(".bedroomDurationxAxis path")
    .style("display", "none")

    bedroomDurationxAxis.append("text")
    .attr("x", width)
    .attr("dx", "0.71em")
    .attr("dy", "1.5em")
    .style("text-anchor", "end")
    .text("Passed Eight Days")
    .style("fill", "#1E1E1F")
    .style("font-size", "13px");
  },
  createGraphyAxis: function(svg) {
    var bedroomDurationyAxis = svg.append("g").attr("class", "bedroomDurationyAxis")
    .call(yAxis);

    bedroomDurationyAxis.style("fill", "none")
    .style("stroke", "#1E1E1F")
    .style("shape-rendering", "crispEdges")
    .style("stroke-width", "1.0px")
    // This is how you select text of the axis
    // console.log(d3.selectAll(".x.axis g.tick text"))
    d3.selectAll(".bedroomDurationyAxis g.tick text")
    .style("fill", "#1E1E1F")
    .style("font-size", "15px")

    bedroomDurationyAxis.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("x", -10)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Duration (hours)")
    .style("stroke", "#1E1E1F")
    .style("font-size", "13px")
    .style("fill", "#1E1E1F")
  },
  getColorsAndIndexes: function() {
    return [
      {indexLte: 300, backgroundColor: '#e8c1f3', borderColor: '#d182e8', opacity: 0.8},
      {indexLte: 150, backgroundColor: '#f76454', borderColor: '#f34b38', opacity: 0.7},
      {indexLte: 100, backgroundColor: '#f7b854', borderColor: '#f4ac39', opacity: 0.65},
      {indexLte: 50, backgroundColor: '#f7e654', borderColor: '#f1de37', opacity: 0.6},
      {indexLte: 20, backgroundColor: '#a7ea6b', borderColor: '#9ddd65', opacity: 0.55},
      {indexLte: 0, backgroundColor: '#5dee52', borderColor: '#00e400', opacity: 0.5}
    ];
  },
  drawLine: function(svg) {
    bedroomSleepLine = svg.selectAll(".bedroomSleepDuration")
    .data(locationDurationData).enter().append("g")
    .attr("class", ".bedroomSleppDuration")

    bedroomSleepLine.append("path")
    .attr("class", "bedroomSleepDurationLine")
    .attr("d", function(d) { return line(d.values); })
    .style("fill", "none")
    .style("stroke", function(d) { return color(d.name); })
    .style("stroke-width", "3px")

    svg.append("path").attr("class", "normalSleepDurationLine")
    .attr("d", normalSleepLine(normalSleepLineData))
    .style("fill", "none")
    .style("stroke", "steelblue")
    .style("stroke-dasharray", ("3, 3"))
  },
  drawCircle: function(svg, bedroomSleepLine) {
    bedroomSleepLine.style("fill", "#FFF")
    .style("stroke", function(d) { return color(d.name); })
    .selectAll(".sleepCircles")
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
    .datum(normalSleepLineData)
    .attr("class", "normalSleepArea")
    // .style("fill", "url(#myGradient)")
    .attr("d", sleepNormalArea)
    .style("opacity", 0.5)
    .style("fill", "lightsteelblue")
  }
}
