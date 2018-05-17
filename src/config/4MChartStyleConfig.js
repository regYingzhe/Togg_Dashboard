const axisTextColor = "#CCCCCC";
const axisFontSize = "20px";
const dataLineStrokeWidth = "3px";

const chartStyle = {
  visitTimesBox: {
    boarderColor: axisTextColor
  },
  indictorBoundary: {
    overflow: "visible"
  },
  xAxisText: {
    dx: "0.71em",
    dy: "1.0em",
    textAnchor: "end",
    fill: axisTextColor,
    fontSize: axisFontSize
  },
  yAxisText: {
    dy: "0.71em",
    textAncor: "end",
    fontSize: axisFontSize,
    fill: axisTextColor
  },
  dataLine: {
    fill: "none",
    strokeWidth: dataLineStrokeWidth
  },
  normalDataLine: {
    fill: "none",
    stroke: "black",
    strokeDashArray: "3, 3"
  },
  normalDataArea: {
    opacity: 0.08,
    fill: "#91b76b",
    forBedroom: "#91b76b",
    forBathroom: "FADFAE"
  }
}
module.exports = chartStyle;
