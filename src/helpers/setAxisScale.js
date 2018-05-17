module.exports = {
  setAxisScale: function(xScale, xScale2, yScale) {
    console.log("Inside setupAxis");
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    xAxis2 = d3.svg.axis().scale(xScale2).orient("bottom");
    yAxis = d3.svg.axis().scale(yScale).orient("left");
  }
}
