//Source: https://bl.ocks.org/nbremer/d2720fdaab1123df73f4806360a09c9e

////////////////////////////////////////////////////////////
//////////////////////// Set-Up ////////////////////////////
////////////////////////////////////////////////////////////

d3.json("data.json", function(error, data) {
	var matrix = data["result"];
	var Names = data["names"];
	var colors = d3.scale.category20();
	// console.log(colorScale(0))

	var margin = {left:90, top:90, right:90, bottom:90},
		width = Math.min(window.innerWidth, 700) - margin.left - margin.right,
	    height = Math.min(window.innerWidth, 700) - margin.top - margin.bottom,
	    innerRadius = Math.min(width, height) * .39,
	    outerRadius = innerRadius * 1.1;
		
	var	opacityDefault = 0.8;

	////////////////////////////////////////////////////////////
	/////////// Create scale and layout functions //////////////
	////////////////////////////////////////////////////////////

	var chord = d3.layout.chord()
	    .padding(.15)
	    .sortChords(d3.descending)
		.matrix(matrix);
			
	var arc = d3.svg.arc()
	    .innerRadius(innerRadius*1.01)
	    .outerRadius(outerRadius);

	var path = d3.svg.chord()
		.radius(innerRadius);
		
	////////////////////////////////////////////////////////////
	////////////////////// Create SVG //////////////////////////
	////////////////////////////////////////////////////////////
		
	var svg = d3.select("#chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")");
			
	////////////////////////////////////////////////////////////
	////////////////// Draw outer Arcs /////////////////////////
	////////////////////////////////////////////////////////////

	var outerArcs = svg.selectAll("g.group")
		.data(chord.groups)
		.enter().append("g")
		.attr("class", "group")
		.on("mouseover", fade(.1))
		.on("mouseout", fade(opacityDefault));

	outerArcs.append("path")
		.style("fill", function(d) { return colors(d.index); })
		.attr("d", arc);
		
	////////////////////////////////////////////////////////////
	////////////////////// Append Names ////////////////////////
	////////////////////////////////////////////////////////////

	//Append the label names on the outside
	outerArcs.append("text")
	  .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
	  .attr("dy", ".35em")
	  .attr("class", "titles")
	  .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	  .attr("transform", function(d) {
			return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
			+ "translate(" + (outerRadius + 10) + ")"
			+ (d.angle > Math.PI ? "rotate(180)" : "");
	  })
	  .text(function(d,i) { return Names[i]; });
		
	////////////////////////////////////////////////////////////
	////////////////// Draw inner chords ///////////////////////
	////////////////////////////////////////////////////////////
	  
	svg.selectAll("path.chord")
		.data(chord.chords)
		.enter().append("path")
		.attr("class", "chord")
		.style("fill", function(d) { return colors(d.source.index); })
		.style("opacity", opacityDefault)
		.attr("d", path);

	////////////////////////////////////////////////////////////
	////////////////// Extra Functions /////////////////////////
	////////////////////////////////////////////////////////////

	//Returns an event handler for fading a given chord group.
	function fade(opacity) {
	  return function(d,i) {
	    svg.selectAll("path.chord")
	        .filter(function(d) { return d.source.index != i && d.target.index != i; })
			.transition()
	        .style("opacity", opacity);
	  };
	}//fade
});