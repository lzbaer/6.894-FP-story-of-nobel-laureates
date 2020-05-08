function handleMouseOver(d, i) {
  d3.select(this).attr('transform', function(d) {
          var scale = flowerSizeScale;
          var x = (i % 5) * flowerSize- 20;
          var y = Math.floor(i / 5) * flowerSize * .62;
          return 'translate(' + [x, y] +
            ')scale(' + (scale * 1.2) + ')';
          })
}

function handleMouseOut(d, i) {
  d3.select(this).attr('transform', function(d) {
          var scale = flowerSizeScale;
          var x = (i % 5) * flowerSize;
          var y = Math.floor(i / 5) * flowerSize * .62;
          return 'translate(' + [x, y] +
            ')scale(' + (scale) + ')';
          })
}

//field button toggle
var fieldbuttons = document.getElementsByClassName("toggle_button");
var i;

for (i = 0; i < fieldbuttons.length; i++) {
  fieldbuttons[i].addEventListener("click", function() {
    this.classList.toggle('selected');
  })
};

function orderButton(clicked, class_name) {
  var buttons = document.getElementsByClassName(class_name);
  var i;
  if (clicked.classList.contains("selected")) {} else {
    clicked.classList.toggle('selected');
  }
  for (i = 0; i < buttons.length; i++) {
    if (buttons[i].id === clicked.id) {}
    else {
      if (buttons[i].classList.contains("selected")) {
        buttons[i].classList.toggle('selected');
      };
    }
  };
};

function getSelectedButton(class_name) {
  var buttons = document.getElementsByClassName(class_name);
  var i;
  for (i = 0; i < buttons.length; i++) {
    if (buttons[i].classList.contains("selected")) {
        return buttons[i].id;
    };
  };
};

$.extend( $.ui.slider.prototype.options, { 
    animate: 300
});

function getSelectedButtons(class_name){
  var buttons = document.getElementsByClassName(class_name);
  var i;
  var selected = [];
  for (i = 0; i < buttons.length; i++) {
    if (buttons[i].classList.contains("selected")) {
        selected.push(buttons[i].id);
    };
  };
  return selected;
};


var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = (2*content.scrollHeight) + "px";
    } 
  });
};
$("#flat-slider-vertical-1")
    .slider({
        max: 99,
        min: 0,
        range: true,
        values: [0, 99],
        orientation: "vertical"
    });
$("#flat-slider-vertical-3")
    .slider({
        max: 99,
        min: 0,
        range: true,
        values: [0, 99],
        orientation: "vertical"
    });
$("#flat-slider-vertical-2")
    .slider({
        max: 2016,
        min: 1901,
        range: true,
        values: [1901, 2016],
        orientation: "vertical"
  });
  $("#flat-slider-vertical-1, #flat-slider-vertical-2, #flat-slider-vertical-3")
  .slider("pips", {
      first: "pip",
      last: "pip"
  })
  .slider("float");

var strokeColor = '#444';
var flowerSize = 200;
var padding = 10;
var legend = d3.select('.fixed svg');

var svg = d3.select('.content svg')
	.style('left', '20px')
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

var topFields;
var laureate_data;
/*****************************************************
** get laureate data
******************************************************/

d3.json('flowerdata.json', function(laureates) {
  laureate_data = laureates;
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
  topFields = _.chain(laureates)
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

  /*****************************************************
  ** draw all flowers
  ******************************************************/
  drawFlowers(svg, laureates);
  
  /*****************************************************
  ** add annotation
  ******************************************************/
});

function removeElements(flowers){
    return function(){
        flowers.remove();
    }
}

function sortFunction(a, b, order, dir) {
  if (order == "year") {
    if (dir == "ascend") {
      return d3.ascending(a.year, b.year);
    }
    else {
      return d3.descending(a.year, b.year);
    }
  };
  if (order == "age") {
    if (dir == "ascend") {
      return d3.ascending(a.age, b.age);
    }
    else {
      return d3.descending(a.age, b.age);
    }
  }
  else {
    if (dir == "ascend") {
      return d3.ascending(a.numPublications, b.numPublications);
    }
    else {
      return d3.descending(a.numPublications, b.numPublications);
    }
  }
};

function filterFunction(d, i, include, age_vals, pub_vals, year_vals, fieldsInclude) {
  var included;
  if (d.age >= age_vals[0] 
    && d.age <= age_vals[1]
    && d.numPublications >= pub_vals[0]
    && d.numPublications <= pub_vals[1]
    && d.year >= year_vals[0]
    && d.year <= year_vals[1]
    && d.field[0].indexOf(fieldsInclude) >=0)
    { included = true; }
  else {included = false; }

  if (include && included) {return true; }
  if (!include && !included) {return true; }
  return false;

}

function goButton() {
  //Collapse menu
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].classList.toggle("active");
    var content = coll[i].nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    }
  };

  //Get input values
  //Filtering
  var age_vals = $('#flat-slider-vertical-3').slider("option", "values");
  var pub_vals = $('#flat-slider-vertical-1').slider("option", "values");
  var year_vals = $('#flat-slider-vertical-2').slider("option", "values");
  var fieldsInclude = getSelectedButtons('field_button');
  //Ordering
  var order = getSelectedButton('order_button');
  var dir = getSelectedButton('dir_button');


  //update elements
  var svg = d3.select('.content svg');
  var flowers = svg.selectAll('g.flower');

  flowers
    .filter((d, i) => filterFunction(d, i, true, age_vals, pub_vals, year_vals, fieldsInclude))
    .sort((a, b) => sortFunction(a, b, order, dir))
    .attr("opacity", 1)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .transition()
    .duration(3000)
    .ease(d3.easeExpInOut)
    .attr('transform', function(d, i) {
      var scale = flowerSizeScale;
      var x = (i % 5) * flowerSize;
      var y = Math.floor(i / 5) * flowerSize * .62;
      return 'translate(' + [x, y] +
        ')scale(' + scale + ')';
    });

  //hide elements that were filtered out
  flowers
    .filter((d, i) => filterFunction(d, i, false, age_vals, pub_vals, year_vals, fieldsInclude))
    .attr("opacity", 0)

}

function drawFlowers(svg, laureates) {
  console.log(laureates);
  console.log(svg);
  // draw flower for each laureate
  var flowers = svg.selectAll('g.flower')
    .data(_.values(laureates)).enter()
    .append('g')
    .classed('flower', true)

    .attr('transform', function(d, i) {
      var scale = flowerSizeScale;
      var x = (i % 5) * flowerSize;
      var y = Math.floor(i / 5) * flowerSize * .62;
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
      var cy = d.field.length === 1 ? 0 : -flowerSize / 5;
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
    //  return 2 / d.scale;
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
     //.style('position', 'absolute')
     .style('font-size', '50px')
     .style('text-anchor', 'middle')
     // .style('padding', '0 ' + padding + 'px')
     // .style('width', flowerSize - 2 * padding + 'px')
     // .style('left', function(d, i) {
     //   return (i % 4) * flowerSize + 'px';
     // }).style('top', function(d, i) {
     //   return Math.floor(i / 4) * flowerSize + (flowerSize * .75) + 'px';
     //  })
     .attr('transform', function(d) {
      var cx = flowerSize / 2 / flowerSizeScale;
      var cy = flowerSize / 2 / flowerSizeScale + 200;
      return 'translate(' + [cx, cy] + ')';
    })
      // .attr('text-anchor', 'middle')
      // .attr('x', '50')
      .text(function(d) { if (d.name.length > 30) return d.name.substr(0,27).concat('...'); return d.name} );

    flowers.append('text')
    .style('font-size', '50px')
    // .style('text-anchor', 'middle')
    .append('textPath')
    .attr('xlink:href', '#curve')
    .text(function(d) { return d.year});

}