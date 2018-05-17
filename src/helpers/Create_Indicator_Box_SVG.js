var d3 = require("d3")
// var BedroomDurationCSV = require("../data/Bedroom_Duration.csv");
var patternUtils = require("../util_modules/furniture.js");
var profileImg = require("../assets/images/yoitsu.png")
// console.log(patternUtils.defineFurniture())

var margin = {top: 20, right: 40, bottom: 30, left: 40};
var outterWidth = 550;
var outterHeight = 550;
var width = outterWidth - margin.left - margin.right;
var height = outterHeight - margin.top - margin.bottom;
var svg;
var innerSpace;
var locationName = "Bedroom";
var normalSleepDuration = 6;
var imageProfileCircle;
var userActiveSignal = true;
var indicatorContainer;
var presenceCircle;
var activeMinute = 1;
var activeAction = "Entered"


module.exports = {
  createIndicatorBoxSVG: function () {
    svg = d3.select("div#indicator-container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + outterWidth + " " + outterHeight)
    .classed("svg-indicator-content", true);

    innerSpace = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    this.createIndicatorBoundary(innerSpace);
    this.createImageProfileBoundary(innerSpace);
    this.createProfilePresenceIndicator(indicatorContainer);
    this.createIndicatorText(indicatorContainer);

    patternUtils.defineProfilePattern(innerSpace, 1, "profilePhoto", profileImg);
    patternUtils.placeProfilePhoto(imageProfileCircle, "profilePhoto");
  },
  createIndicatorBoundary: function(svg) {
    indicatorContainer = svg.append("svg")
    .attr("class", "indicatorBoundary")
    .attr("x", 100).attr("y", 5)
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
    .style("fill", "#6F726F");
  },
  createIndicatorText: function(indicatorContainer) {
    // First line telling about time
    indicatorContainer.append("text").attr("class", "actionTime")
    .attr("x", 110).attr("y", 35)
    .text("Timer Initialized")
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("font-family", "sans-serif");

    // Second Line
    var actionLocation = indicatorContainer.append("text").attr("class", "actionLocation")
    .attr("x", 110).attr("y", 75)
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("font-family", "sans-serif");

    actionLocation
    .text("Area Initialized")
  }
}
