var d3 = require('d3')
var toiletImg = require("../assets/images/furniture/Rtoilet.png")

export function defineFurniture(svgDefs, fSize, fId, fImg, fImgCoord = [0, 0]) {
  svgDefs.append("svg:pattern")
  .attr("id", fId)
  .attr("width", fSize)
  .attr("height", fSize)
  .attr("patternUnits", "userSpaceOnUse")
  .append("image")
  .attr("xlink:href", fImg)
  .attr("x", fImgCoord[0])
  .attr("y", fImgCoord[1])
  .attr("width", fSize)
  .attr("height", fSize)
  .attr("preseveAspectRatio", "none");
  // .attr("preserveAspectRatio", "xMinYMin slice");
  // .attr("preserveAspectRatio", "none");
}

export function placeFurniture(furnitureSpace, fId) {
  furnitureSpace.style("fill", "url(#" + fId + ")")
}

export function defineProfilePattern(svgDefs, fSize, fId, fImg) {
  svgDefs.append("pattern")
  .attr("id", fId)
  .attr("width", fSize)
  .attr("height", fSize)
  .attr("patternContentUnits", "objectBoundingBox")
  .append("image")
  .attr("xlink:href", fImg)
  .attr("width", fSize)
  .attr("height", fSize)
  .attr("preserveAspectRatio", "xMinYMin slice");
}

export function placeProfilePhoto(profileSpace, fId) {
  profileSpace.style("fill", "url(#" + fId + ")")
}
