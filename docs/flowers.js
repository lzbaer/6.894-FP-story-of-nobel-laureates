function handleMouseOver(d, i) {
  d3.select(this).attr('transform', function(d) {
          var scale = flowerSizeScale;
          var x = (i % 4) * flowerSize- 20;
          var y = Math.floor(i / 4) * flowerSize;
          return 'translate(' + [x, y] +
            ')scale(' + (scale * 1.2) + ')';
          })
}

function handleMouseOut(d, i) {
  d3.select(this).attr('transform', function(d) {
          var scale = flowerSizeScale;
          var x = (i % 4) * flowerSize;
          var y = Math.floor(i / 4) * flowerSize;
          return 'translate(' + [x, y] +
            ')scale(' + (scale) + ')';
          })
}


var strokeColor = '#444';
var flowerSize = 200;
var padding = 10;
var legend = d3.select('.fixed svg');

var svg = d3.select('.content svg')
	.style('left', flowerSize + 'px')
  .append('g')
	.attr('transform', 'translate(' + [padding, padding] + ')');

svg
.append('path')
  .attr('id', 'curve')
  .style('fill', 'invisible')
  .attr('opacity', '0')
  .attr('d', "M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97")
  .attr('transform', 'translate(300, 200)scale(0.6)rotate(20)')

var years = d3.select('.years');
var titles = d3.select('.titles')
	.style('left', flowerSize + 'px')
	.style('padding', padding + 'px');

var petalPaths = [[
	'M0 0',
  "C50 50 50 100 0 100",
  "C-50 100 -50 50 0 0"
],
[
	'M-35 0',
  'C-25 25 25 25 35 0',
  'C50 25 25 75 0 100',
  'C-25 75 -50 25 -35 0'
],
[
  'M0 0',
  'C50 40 50 70 20 100',
  'L0 85',
  'L-20 100',
  'C-50 70 -50 40 0 0'
],
[
  'M0 0',
  'C50 25 50 75 0 100',
  'C-50 75 -50 25 0 0'
]];
var leaf = [
  'M0 15',
  'C15 40 15 60 0 75',
  'C-15 60 -15 40 0 15'
];

var numPetalScale = d3.scaleQuantize()
	.range(_.range(5, 15));
// var flowerSizeScale = d3.scaleLinear()
// 	.range([.05, .5]);
var flowerSizeScale = 0.25;
var petalScale = d3.scaleOrdinal()
	.domain(['chemistry', 'medicine', 'physics', 'literature'])
	.range(_.range(4));
var petalColors = d3.scaleOrdinal()
	.range(['#FFB09E', '#CBF2BD', '#AFE9FF', '#FFC8F0', '#FFF2B4']);

var indivPetalColors = d3.scaleOrdinal()
  .range(['yellow', 'red', 'blue', 'purple']);

// blur effect taken from visualcinnamon:
// http://www.visualcinnamon.com/2016/05/real-life-motion-effects-d3-visualization.html
var defs = svg.append("defs");
defs.append("filter")
  .attr("id", "motionFilter") 	//Give it a unique ID
  .attr("width", "300%")		//Increase the width of the filter region to remove blur "boundary"
  .attr("x", "-100%") 			//Make sure the center of the "width" lies in the middle of the element
  .append("feGaussianBlur")	//Append a filter technique
  .attr("in", "SourceGraphic")	//Perform the blur on the applied element
  .attr("stdDeviation", "8 8");	//Do a blur of 8 standard deviations in the horizontal and vertical direction

/*****************************************************
** get laureate data
******************************************************/

d3.json('flowerdata.json', function(laureates) {
  laureates = _.chain(laureates)
  	.map(function(laureate) {
    	//year of award
      laureate.year = parseInt(laureate.year);
      //Countries and institutions
      //laureate.ges = laureate.Genre.split(', ');
      //Age
      laureate.age = parseFloat(laureate.age);
      //Number of publications
      laureate.numPublications = parseInt(laureate.numPublications);

      return laureate;
    }).sortBy(function(laureate) {
    	return -laureate.year
    }).value();

  // number of petals depending on number of publications
  var minPubs = d3.min(laureates, function(d) {return d.numPublications});
  var maxPubs = d3.max(laureates, function(d) {return d.numPublications});
  numPetalScale.domain([minPubs, maxPubs]);
  // overall flower size from rating
  var minRating = d3.min(laureates, function(d) {return d.age});
  var maxRating = d3.max(laureates, function(d) {return d.age});
  // flowerSizeScale.domain([minRating, maxRating]);
  // get the top 4 genres by count
  var topFields = _.chain(laureates)
  	.map('field').flatten()
  	.countBy().toPairs()
  	.sortBy(1).map(0)
  	.takeRight(4)
  	.value();
  topFields.push('Other');
  petalColors.domain(topFields);
  // get all the years
  var allYears = _.chain(laureates)
  	.map('year').uniq().value();
  
  /*****************************************************
  ** build legend
  ******************************************************/
  var fontSize = 12;
  var legendWidth = 1090;
  
  // petal shapes
  var legendPetalShapes = legend.append('g')
  	// .attr('transform', 'translate(' + (legendWidth / 2) + ',0)')
  	.selectAll('g')
  	.data(['chemistry', 'medicine', 'physics', 'literature'])
  	.enter().append('g')
  	.attr('transform', function(d, i) {
      var x = i * (flowerSize / 2) - 112.5;
      return 'translate(' + [x, 0] + ')scale(0.5)'
    });
  legendPetalShapes.append('path')
    .attr('fill', 'none')
    .attr('stroke', strokeColor)
    .attr('stroke-width', 4)
    .attr('d', function(rating) {
      return petalPaths[petalScale(rating)];
    });
  legendPetalShapes.append('text')
  	.attr('y', flowerSize)
  	.attr('text-anchor', 'middle')
  	.attr('fill', strokeColor)
  	.style('font-size', fontSize / .5 + 'px')
  	.text(function(d) {return d});
  
  // petal colors
  var legendPetalColors = legend.append('g')
  	// .attr('transform',
   //        'translate(' + [legendWidth / 2, flowerSize * .9] + ')')
  	.selectAll('g').data(topFields)
  	.enter().append('g')
    .attr('transform', function(d, i) {
      var x = i * (flowerSize / 2) - flowerSize;
      return 'translate(' + [x, 0] + ')scale(0.5)';
    });
  legendPetalColors.append('circle')
  	.attr('r', flowerSize / 3)
  	.attr('fill', function(d) {return petalColors(d)})
  	.style("filter", "url(#motionFilter)");
  legendPetalColors.append('text')
  	.attr('y', flowerSize * .75)
  	.attr('text-anchor', 'middle')
  	.attr('fill', strokeColor)
  	.style('font-size', fontSize / .5 + 'px')
  	.text(function(d) {return d});
  
  // number of petals in a flower
  var legendNumPetals = legend.append('g')
  	.attr('transform',
          'translate(' + [legendWidth / 2, flowerSize * .9 * 2] + ')')
  	.selectAll('g')
  	.data(_.times(5, function(i) {
      var pubs = minPubs + (maxPubs - minPubs) / 4 * i;
      return Math.round(pubs);
    })).enter().append('g')
    .attr('transform', function(d, i) {
      var x = i * (flowerSize * .6) - (flowerSize * .6 * 2);
      return 'translate(' + [x, 0] + ')scale(0.3)';
    });
  
  legendNumPetals.selectAll('path')
    .data(function(d) {
    	var numPetals = numPetalScale(d);
    	var path = petalPaths[petalScale('chemistry')];
      return _.times(numPetals, function(i) {
        return {
          angle: (360/numPetals) * i,
          path: path
        }
      });
    }).enter().append('path')
    .attr('stroke', strokeColor)
    .attr('stroke-width', 2 / .3)
    .attr('fill', 'none')
    .attr('d', function(d) {return d.path.join(' ')})
    .attr('transform', function(d) {
      return 'rotate(' + [d.angle] + ')';
    });
  
  legendNumPetals.append('text')
  	.attr('y', flowerSize * 1.25)
  	.attr('text-anchor', 'middle')
  	.attr('fill', strokeColor)
  	.style('font-size', fontSize / .3 + 'px')
  	.text(function(d, i) {
     	return d3.format(',')(d ) +
      	(i === 0 ? ' publications' : '');
   	});
  
  // size of flower 
  var legendPetalSizes = legend.append('g')
  	.attr('transform',
          'translate(' + [legendWidth / 2, flowerSize * .9 * 3] + ')')
  	.selectAll('g')
  	.data(_.times(5, function(i) {
      return minRating + (maxRating - minRating) / 4 * i;
    })).enter().append('g')
    .attr('transform', function(d, i) {
      var x = i * (flowerSize * .8) - (flowerSize * .8 * 2);
      return 'translate(' + [x, 0] + ')';
    });
  
  legendPetalSizes.selectAll('path')
    .data(function(rating) {
    	var numPetals = 5;
    	var path = petalPaths[petalScale('chemistry')];
      return _.times(numPetals, function(i) {
        return {
          scale: flowerSizeScale,
          angle: (360/numPetals) * i,
          path: path
        }
      });
    }).enter().append('path')
    .attr('stroke', strokeColor)
    .attr('stroke-width', function(d) {
      return 2 / d.scale;
    }).attr('fill', 'none')
    .attr('d', function(d) {return d.path.join(' ')})
    .attr('transform', function(d) {
      return 'rotate(' + [d.angle] + ')scale(' + d.scale + ')';
    });
  
  legendPetalSizes.append('text')
  	.attr('y', flowerSize / 2)
  	.attr('dy', '.35em')
  	.attr('text-anchor', 'middle')
  	.attr('fill', strokeColor)
  	.style('font-size', fontSize)
    .text(function(d, i) {
     	return d3.format('.0f')(d) + ' years old';
   	});
  /*****************************************************
  ** draw all flowers
  ******************************************************/
  
  // draw flower for each laureate
  var flowers = svg.selectAll('g.flower')
    .data(_.values(laureates)).enter().append('g')
    .classed('flower', true)
    .attr('transform', function(d, i) {
      var scale = flowerSizeScale;
      var x = (i % 4) * flowerSize;
      var y = Math.floor(i / 4) * flowerSize;
      return 'translate(' + [x, y] +
        ')scale(' + scale + ')';
    }).on('click', function(d) {
      window.open('http://nobelprize.org/prizes/' + d.field[0] +  '/' + d.year + '/' + d.lastName);
    }).on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
  
  // create the data for each flower's colors
  flowers.selectAll('circle')
  	.data(function(d) {
    	// if there's only one genre, center the circle
    	var cy = d.field.length === 1 ? 0 : -flowerSize / 4;
      return _.map(d.field, function(field, i) {
        field = _.includes(topFields, field) ? field : 'Other';
        return {
          cy: cy,
          scale: flowerSizeScale,
          angle: (360/d.field.length) * i,
          fill: petalColors(field)
        }
      });
    }).enter().append('circle')
  	.attr('cy', function(d) {return d.cy})
    .attr('r', flowerSize / 2)
  	.attr('fill', function(d) {return d.fill})
  	.attr('transform', function(d) {
      var x = flowerSize / 2 / d.scale;
      var y = flowerSize / 2 / d.scale;
      return 'translate(' + [x, y] +
        ')rotate(' + d.angle + ')';
    }).style("filter", "url(#motionFilter)");
  
  // draw the flower petals
  flowers.selectAll('path.petal')
    .data(function(d) {
    	// var numPetals = numPetalScale(d.numPublications);
      var numPetals = 5;
    	var path = petalPaths[petalScale(d.field[0])];
      return _.times(numPetals, function(i) {
        return {
          scale: flowerSizeScale,
          angle: (360/numPetals) * i,
          path: path,
          field: d.field[0]
        }
      });
    }).enter().append('path')
      .classed('petal', true)
    .attr('stroke', strokeColor)
    .attr('stroke-width', function(d) {
      return 2 / d.scale;
    //}).attr('fill', function(d, i) { if (i > 3) return "None"; return indivPetalColors(i) ; })
    }).attr('fill', function(d) {
        return petalColors(d.field) 
    })
    .attr('d', function(d) {return d.path.join(' ')})
    .attr('transform', function(d) {
      var cx = flowerSize / 2 / d.scale;
      var cy = flowerSize / 2 / d.scale;
      return 'translate(' + [cx, cy] +
        ')rotate(' + [d.angle] + ')';
    });
    // }).enter().append('circle')
  	//.classed('petal', true)
    //.attr('stroke', strokeColor)
    //.attr('stroke-width', function(d) {
    //	return 2 / d.scale;
    // .attr('fill', 'yellow')
    // .attr('r', 20)
    // //.attr('d', function(d) {return d.path.join(' ')})
    // .attr('transform', function(d, i) {
    //   var cx = flowerSize / 2 / d.scale - (i*20);
    //   var cy = flowerSize / 2 / d.scale + (i*20);
    //   return 'translate(' + [cx, cy] +
    //     ')rotate(' + [d.angle] + ')';
    // });
  
  // draw the leaves
  flowers.selectAll('path.leaf')
  	.data(function(d) {
    	var leaves = [];
    	if (1) {
        leaves.push({
          scale: flowerSizeScale,
          angle: -120
        });
      }
    	if (1) {
        leaves.push({
          scale: flowerSizeScale,
          angle: 120
        });
      }
    	return leaves;
    }).enter().append('path')
    .classed('leaf', true)
    .attr('stroke', '#555')
    .attr('stroke-width', function(d) {
    	return 2 / d.scale;
    }).attr('fill', '#4AB56D')
  	.attr('d', leaf.join(' '))
  	.attr('transform', function(d) {
    	var cx = flowerSize / 2 / d.scale;
      var cy = flowerSize / 2 / d.scale + 150;
      return 'translate(' + [cx, cy] +
        ')rotate(' + [d.angle] + ')';
    });
    
    flowers.append('text')
    // .classed('title', true)
     .style('position', 'absolute')
     .style('font-size', '50px')
     // .style('padding', '0 ' + padding + 'px')
     // .style('width', flowerSize - 2 * padding + 'px')
     // .style('left', function(d, i) {
     //   return (i % 4) * flowerSize + 'px';
     // }).style('top', function(d, i) {
     //   return Math.floor(i / 4) * flowerSize + (flowerSize * .75) + 'px';
     //  })
     .attr('transform', function(d) {
      var cx = flowerSize / 2 / flowerSizeScale - 200;
      var cy = flowerSize / 2 / flowerSizeScale + 200;
      return 'translate(' + [cx, cy] + ')';
    })
      // .attr('text-anchor', 'middle')
      // .attr('x', '50')
      .text(function(d) { return d.name} );

    flowers.append('text')
    .style('font-size', '50px')
    // .style('text-anchor', 'middle')
    .append('textPath')
    .attr('xlink:href', '#curve')
    .text(function(d) { return d.year});
  /*****************************************************
  ** add annotation
  ******************************************************/
  
  // add the years to titles
//   years.selectAll('.year')
//   	.data(allYears).enter().append('h1')
//   	.classed('year', true)
//   	.style('margin', 0)
//   	.style('position', 'absolute')
//   	.style('width', flowerSize + 'px')
//     .style('top', function(d, i) {
//     	return i * flowerSize * 1.5 + flowerSize / 2 + 'px';
//     })
//     .text(function(d) {return d});
  
//   // finally add the titles
//   titles.selectAll('.title')
//   	.data(_.values(laureates))
//     .enter().append('div')
//   	.classed('title', true)
//   	.style('position', 'absolute')
//   	.style('padding', '0 ' + padding + 'px')
//   	.style('width', flowerSize - 2 * padding + 'px')
//   	.style('left', function(d, i) {
//     	return (i % 4) * flowerSize + 'px';
//   	}).style('top', function(d, i) {
//     	return Math.floor(i / 4) * flowerSize + (flowerSize * .75) + 'px';
//     }).text(function(d) {
//     	return d.name;
//     });
});