// var exports = module.exports = {}
var d3 = require("d3")
var setAxisScale = require("./setAxisScale.js")
var csv = require("../data/sample.csv");


var margin = {top: 10, right: 200, bottom: 180, left: 40};
var margin2 = {top: 400, right: 10, bottom: 20, left: 40};
var outterWidth = 960;
var outterHeight = 500;
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var height2 = 500 - margin2.top - margin2.bottom; // 80

var parseDate = d3.time.format("%Y%m%d");
var bisectDate = d3.bisector(function(d) { return d.date }).left;

var xScale = d3.time.scale().range([0, width]);
var xScale2 = d3.time.scale().range([0, width]);
var yScale = d3.scale.linear().range([height, 0]);
var color = d3.scale.ordinal().range(["#48A36D", "#56AE7C", "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", "#E39158", "#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"]);
// console.log("color is ", color);
// console.log("color function output ", color(0));

var xAxis;
var xAxis2;
var yAxis;
var line;
var maxY;
var svg;
var innerSpace;
var mouseTrackArea;
var context;
var roomLocation;
var brush;
var locationDuration;
var contextArea;
var legendSpace;
var hoverLineGroup;
var hoverDate;
var columnNames;
var focus;
var parsingSignal = true;

module.exports = {
  createSVG: function () {
    svg = d3.select("div#duration-container").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + outterWidth + " " + outterHeight)
        .classed("svg-duration-content", true);

    innerSpace = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.setAxisScale(xScale, xScale2, yScale);
    this.setLine(xScale, yScale);
    // console.log("xAxis is", xAxis);
    this.mouseTracking(innerSpace);
    this.createBrushingContext(innerSpace);
    this.createClipPath(innerSpace);
    // console.log(csv[0]);
    color.domain(d3.keys(csv[0]).filter(function(key) {
      return key !== "date";
    }));
    // console.log(color.domain())
    // console.log(parseDate);

    while (parsingSignal) {
      csv.forEach(function(d) {
        d.date = parseDate.parse("" + d.date);
      })
      parsingSignal = false;
    }


    roomLocation = color.domain().map(function(name) {
      return {
        name: name,
        values: csv.map(function(d) {
          return {
            date: d.date,
            duration: +d[name]
          }
        }),
        visible: (name === "Bedroom" ? true : false)
      }
    })
    // console.log("roomLocation Data is", roomLocation);

    this.setAxisDomain(xScale, xScale2, yScale, csv);
    this.createGraphxAxis(innerSpace);
    this.createGraphyAxis(innerSpace);
    this.createBrushingXAxis(context);
    this.setAreaChart();
    this.drawRectBar(roomLocation);

    locationDuration = innerSpace.selectAll(".locationDuration")
    .data(roomLocation).enter().append("g")
    .attr("class", "roomLocation");

    // Create Lines
    locationDuration.append("path")
    .attr("class", "line")
    .style("pointer-events", "none")
    .attr("id", function(d) {
      return "line-" + d.name.replace(" ", "")
      .replace("/", "")
    })
    .attr("d", function(d) {
      return d.visible ? line(d.values) : null
    })
    .attr("clip-path", "url(#clip)")
    .style("stroke", function(d) { return color(d.name) })
    .attr("fill", "none")

    brush = d3.svg.brush().x(xScale2).on("brush", brushed);

    context.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("height", height2)
    .attr("fill", "#E6E7E8");

    legendSpace = 430 / roomLocation.length;
    // Create legned box for selecting duration for different room locations.
    locationDuration.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("x", width + (margin.right / 3) - 15)
    .attr("y", function(d, i) {
      return legendSpace + i * legendSpace - 8;
    })
    .attr("fill", function(d) {
      return d.visible ? color(d.name) : "#F1F1F2";
    })
    .attr("class", "legend-box")
    .on("click", function(d) {
      // mouseclick(d);
      d.visible = !d.visible;
      maxY = findMaxY(roomLocation);
      yScale.domain([0, maxY]);
      innerSpace.select(".y.axis").transition().call(yAxis);

      locationDuration.select("path")
      .transition()
      .attr("d", function(d) {
        return d.visible ? line(d.values) : null;
      })

      // Update selected square
      locationDuration.select("rect")
      .transition()
      .attr("fill", function(d) {
        return d.visible ? color(d.name) : "#F1F1F2";
      })
    })
    .on("mouseover", function(d) {
      // mouseover(d);
      d3.select(this).transition()
      .attr("fill", function(d) { return color(d.name); });
      d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
      .transition()
      .style("stroke-width", 2.5);
    })
    .on("mouseout", function(d) {
      // mouseout(d);
      d3.select(this).transition()
      .attr("fill", function(d) {
        return d.visible ? color(d.name) : "#F1F1F2";
      });

      d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
      .transition().style("stroke-width", 1.5)
    })
    // Create lengend for each room location
    locationDuration.append("text")
    .attr("x", width + (margin.right / 3))
    .attr("y", function(d, i) { return legendSpace + i * legendSpace; })
    .text(function(d) { return d.name; })
    .style("font-size", "10px");

    this.createHoverLine(innerSpace);
    this.createHoverDate(innerSpace);

    columnNames = d3.keys(csv[0]).slice(1);
    console.log("columnNames is ", columnNames);

    focus = locationDuration.select("g")
    .data(columnNames) // bind each column name date to each g element
    .enter().append("g") // create one <g> for each columnName
    .attr("class", "focus")

    focus.append("text")
    .attr("class", "tooltip")
    .attr("x", width + 20) // position tooltips
    .attr("y", function (d, i) { return (legendSpace) + i * (legendSpace); })
    .style("stroke", "10px")
    .style("font-size", "10px")

    d3.select("#mouse-tracker")
    .on("mousemove", mousemove)
    .on("mouseout", function() {
      hoverDate
      .text(null) // on mouseout remove text for hover date

      d3.select("#hover-line")
      .style("opacity", 1e-6); // On mouse out making line invisible

      d3.selectAll(".tooltip").style("opacity", 0);
    })

    function mousemove() {
      var mouseX = d3.mouse(this)[0];
      // console.log(d3.mouse(this))
      var graphX = xScale.invert(mouseX);
      // console.log("graphX is ", graphX);
      var format = d3.time.format("%b %Y");
      // console.log("format graphX is ", format(graphX));
      d3.selectAll(".tooltip").style("opacity", 1);
      hoverDate.text(format(graphX))
      .style("opacity", 1);
      d3.select("#hover-line") // select hover-line and changing attributes to mouse position
      .attr("x1", mouseX)
      .attr("x2", mouseX)
      .style("opacity", 1); // Making line visible

      var i = bisectDate(csv, graphX, 1);
      var d0 = csv[i - 1];
      var d1 = csv[i];
      var d = graphX - d0.date > d1.date - graphX ? d1 : d0;
      focus.select("text").text(function(columnName) {
        return (d[columnName]);
      });
    }


    function brushed() {
      console.log("Inside brushed callback function")
      xScale.domain(brush.empty() ? xScale2.domain() : brush.extent());
      // replot xAxis with transition when brush used
      d3.selectAll(".x.axis").transition().call(xAxis);
      // Find max Y duratin value roomlocation data with "visible"; true
      d3.selectAll(".x.axis g.tick text")
      .style("fill", "#1E1E1F")
      .style("font-size", "15px")

      maxY = findMaxY(roomLocation);
      // Redefine yAxis domain based on highest y value of roomLocation data with "visible"; true
      yScale.domain([0, maxY]);
      // Redraw yAxis
      innerSpace.select(".y.axis").transition().call(yAxis);
      // Redraw lines based on brush xAxis scale and domain
      // If d.visible is true then draw line for this d selection
      locationDuration.select("path").transition().attr("d", function(d) {
        return d.visible ? line(d.values) : null;
      })
    }

    function findMaxY(data) {
      var maxYValues = data.map(function(d) {
        if (d.visible) {
          return d3.max(d.values, function(value) {
            return value.duration;
          })
        };
      })
      return d3.max(maxYValues);
    }
  },
  setAxisScale: function(xScale, xScale2, yScale) {
    console.log("Inside setupAxis");
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    xAxis2 = d3.svg.axis().scale(xScale2).orient("bottom");
    yAxis = d3.svg.axis().scale(yScale).orient("left");
  },
  setLine: function(xScale, yScale) {
    console.log("Inside setLine")
    // for missing data
    line = d3.svg.line().interpolate("basic")
          .x(function(d) { return xScale(d.date) })
          .y(function(d) { return yScale(d.duration) })
          .defined(function(d) { return d.duration })
  },
  mouseTracking: function(svg) {
    mouseTrackArea = svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0)
      .attr("id", "mouse-tracker")
      .style("fill", "gray");
  },
  createBrushingContext: function(svg) {
    context = svg.append("g")
    .attr("transform", "translate(" + 0 + "," + 350 + ")")
    .attr("class", "context")
  },
  createClipPath: function(svg) {
    svg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height)
  },
  setAxisDomain: function(xScale, xScale2, yScale, data) {
    xScale.domain(d3.extent(data, function(d) { return d.date; }));
    xScale2.domain(xScale.domain());
    // Duration Range
    yScale.domain([0, 100]);
  },
  createGraphxAxis: function(svg) {
    var durationxAxis = svg.append("g").attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    durationxAxis.style("fill", "none")
    .style("stroke", "#1E1E1F")
    .style("shape-rendering", "crispEdges")
    .style("stroke-width", "1.0px")
    // This is how you select text of the axis
    // console.log(d3.selectAll(".x.axis g.tick text"))
    d3.selectAll(".x.axis g.tick text")
    .style("fill", "#1E1E1F")
    .style("font-size", "15px")
  },
  createGraphyAxis: function(svg) {
    var durationyAxis = svg.append("g").attr("class", "y axis")
    .call(yAxis)

    durationyAxis.style("fill", "none")
    .style("stroke", "#1E1E1F")
    .style("shape-rendering", "crispEdges")
    .style("stroke-width", "1.0px")

    d3.selectAll(".y.axis g.tick text")
    .style("fill", "#1E1E1F")
    .style("font-size", "15px")
    // .style("stroke", "#8E6604")

    durationyAxis.append("text")
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
  createBrushingXAxis: function(content) {
    var brushxAxis = content.append("g").attr("class", "x axis1")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2);

    brushxAxis.style("fill", "none")
    .style("stroke", "#1E1E1F")
    .style("shape-rendering", "crispEdges")
    .style("stroke-width", "1.0px")

    d3.selectAll(".x.axis1 g.tick text")
    .style("fill", "#1E1E1F")
    .style("font-size", "15px")
  },
  setAreaChart: function() {
    contextArea = d3.svg.area().interpolate("monotone")
    .x(function(d) {
      return xScale2(d.date)
    })
    .y0(height2)
    .y1(0);
  },
  drawRectBar: function(roomLocation) {
    context.append("path")
    .attr("class", "area")
    .attr("d", contextArea(roomLocation[0].values))
    .attr("fill", "#F1F1F2");
  },
  createHoverLine: function(svg) {
    hoverLineGroup = svg.append("g").attr("class", "hover-line")
    .append("line")
    .attr("id", "hover-line")
    .attr("x1", 10).attr("x2", 10)
    .attr("y1", 0).attr("y2", height)
    .style("pointer-events", "none") // Stop line interferring with cursor
    .style("stroke", "white")
    .style("opacity", 1e-6)
    .style("stroke-linecap", "round")
    .style("stroke-width", 1)
    .style("stroke-dasharray", "2,5")
    .style("fill", "none");
  },
  createHoverDate: function(innerSpace) {
    hoverDate = innerSpace
    .append('text')
    .attr("class", "hover-text")
    .attr("y", height - (height - 40)) // hover date text position
    .attr("x", width - 150) // hover date text position
    .style("fill", "#E6E7E8")
  }
}
