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
function handleClick(d, i, index) {
  var popup = $('#flowerdetails');
  if (popup.hasClass('open')) {
    return;
  }
  else {
    popup.addClass('open');
    var flower_picked = d3.select(this);
    var children = flower_picked.nodes().map(function(d) { return d.innerHTML; });
    var flower_picked_data = flower_picked.data()[0]
    var selected = d3.select('#flowerdetails').append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('margin-top', '0%')
      //.attr('viewbox', '0 0 20 10')
      // .style('margin-left', '5%')
      // .style('margin-right', '5%')
      // .style('margin-bottom', '5%')
      .style('max-height', '350px')
      .style('position', 'relative');

    selected  
      .append('rect')
      .attr('width', '100%')
      .attr('height', '90%')
      .style('fill', '#E8E8E8')
      .style('border', 'solid')
      .style('stroke', 'black')
      .style('transform', 'translate(0px, 5px)')
      .on('click', function(d) {
        popup.removeClass('open');
        selected.remove(); 
      });

    selected
      .append('text')
      .attr('font-size', '25px')
      .text(flower_picked_data.name)
      .style('transform', 'translate(5%, 10%)');

    var flowerdiv = selected.append('svg')
      //.attr('x', '50%')
      //.attr('y', '100%')
      //.style('transform', 'translate(-50%,-100%)');

    flowerdiv
      .append('g')
      .style('transform', 'translate(-10%,-15%)scale(0.5)')
      .attr('id', 'test')
      .on('click', function(d) { return window.open('http://nobelprize.org/prizes/' + flower_picked_data.field[0] +  '/' + flower_picked_data.year + '/' + flower_picked_data.lastName) } )
      .html(children);

    flowerdiv
      .select('g')
      .select('text').remove();

    var infosvg = selected.append('svg')
      .append('g')
      .attr('width', '50%')
      .style('transform', 'translate(40%)');

    infosvg
      .append('text')
      .style('transform', 'translate(5%, 15%)')
      .text('Field: ' + flower_picked_data.field[0]);

    var button = infosvg.append('g').attr('transform', 'translate(50, 50)')
      button
      .append('path')
      .attr("d", "M10,40 h50 q5,0 5,5 v10 q0,5 -5,5 h-50 z")
      .attr('fill', function(d) {if (!flower_picked_data.mobility) return "#6e6b6a"; else return 'white'})
      .attr('stroke', "black")
      .attr('transform', 'translate(100,-50)scale(2)');
      button
      .append('path')
      .attr("d", "M10,40 h50 q5,0 5,5 v10 q0,5 -5,5 h-50 z")
      .attr('fill', function(d) {if (flower_picked_data.mobility) return "#6e6b6a"; else return 'white'})
      .attr('stroke', "black")
      .attr('transform', 'translate(120,150)rotate(180)scale(2)');

      button.append('text')
        .style('transform', 'translate(10px, 55px)')
        .text('Migrated');
      button.append('text')
        .style('transform', 'translate(140px, 55px)')
        .text('Stayed');

    infosvg
      .append('text')
      .style('transform', 'translate(5%, 45%)')
      .text('Number of Publication: ' + flower_picked_data.numPublications);

    button = infosvg.append('g').attr('transform', 'translate(50, 200)')
      button
      .append('path')
      .attr("d", "M10,40 h50 q5,0 5,5 v10 q0,5 -5,5 h-50 z")
      .attr('fill', function(d) {if (!flower_picked_data.collaborate) return "#4AB56D"; else return 'white'})
      .attr('stroke', "black")
      .attr('transform', 'translate(100,-100)scale(2)');
      button
      .append('path')
      .attr("d", "M10,40 h50 q5,0 5,5 v10 q0,5 -5,5 h-50 z")
      .attr('fill', function(d) {if (flower_picked_data.collaborate) return "#4AB56D"; else return 'white'})
      .attr('stroke', "black")
      .attr('transform', 'translate(120,100)rotate(180)scale(2)');

      button.append('text')
        .style('transform', 'translate(-5px, 5px)')
        .text('Collaborated');
      button.append('text')
        .style('transform', 'translate(125px, 5px)')
        .text('Independent');
    
    infosvg
      .append('text')
      .style('transform', 'translate(5%, 75%)')
      .text('Age: ' + flower_picked_data.age);
    selected
      .append('text')
      .style('font-size', '14px')
      .style('transform', 'translate(2%, 87%)')
      .text("Click anywhere in the box to close, or click the flower to learn more about this laureate");
  }
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
  console.log(selected);
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
      if (content.id == "legend") {
        $("#texthowmany").css("transform", "translate(0px, 0px)");
        $("#flowerField").css("transform", "translate(10px, 10px)");
        content.style.border = null;
        $(".fixed").css('z-index',-1);
      }
    } else {
      content.style.maxHeight = (2*content.scrollHeight) + "px";
      if (content.id == "legend") {
        console.log($(window).width());
        if ($(window).width() > 980) {
          $("#texthowmany").css("transform", "translate(10%, 0px)");
          $("#flowerField").css("transform", "translate(10%, 10px)");
        
        }
        else {
          $("#texthowmany").css("transform", "translate(200px, 0px)");
          $("#flowerField").css("transform", "translate(200px, 10px)");
        }
        content.style.border = "solid";
        $(".fixed").css('z-index', 1);
      }
    }
  });
};
$("#flat-slider-vertical-1")
    .slider({
        max: 1853,
        min: 1,
        range: true,
        values: [1, 1853],
        orientation: "vertical"
    });
$("#flat-slider-vertical-3")
    .slider({
        max: 88,
        min: 25,
        range: true,
        values: [25, 88],
        orientation: "vertical"
    });
$("#flat-slider-vertical-2")
    .slider({
        max: 2016,
        min: 1902,
        range: true,
        values: [1902, 2016],
        orientation: "vertical"
  });
  $("#flat-slider-vertical-1, #flat-slider-vertical-2, #flat-slider-vertical-3")
  .slider("pips", {
      first: "pip",
      last: "pip"
  })
  .slider("float");

$(window).scroll(function(){
  $('#legendContainer').css('left',-$(window).scrollLeft());
});

var strokeColor = '#444';
var flowerSize = 200;
var padding = 10;
var legend = d3.select('.legend-content svg');

var svg = d3.select('.content svg')
  .attr('id', 'flowerFieldSVG')
  .append('g')
  .attr('id', 'flowerField')
  .attr('style', 'transition:all 2s')
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
  'M0 0',
  'C50 25 50 75 0 100',
  'C-50 75 -50 25 0 0'
],
[
  'M0 0',
  'C50 40 50 70 20 100',
  'L0 85',
  'L-20 100',
  'C-50 70 -50 40 0 0'
],
[
  'M-35 0',
  'C-25 25 25 25 35 0',
  'C50 25 25 75 0 100',
  'C-25 75 -50 25 -35 0'
]
];

var petalPathsLegend = [
  'M0 0 C50 50 50 100 0 100 C-50 100 -50 50 0 0',
  'M0 0 C50 25 50 75 0 100 C-50 75 -50 25 0 0',
  'M0 0 C50 40 50 70 20 100 L0 85 L-20 100 C-50 70 -50 40 0 0',
  'M-35 0 C-25 25 25 25 35 0 C50 25 25 75 0 100 C-25 75 -50 25 -35 0'
];

var leaf = [
  'M0 15',
  'C15 40 15 60 0 75',
  'C-15 60 -15 40 0 15'
];

// var numPetalScale = d3.scaleQuantize()
// 	.range(_.range(5, 15));
// var numPetalScale = d3.scaleQuantize()
//  .range(_.range(5, 15));
var numPetalScale = d3.scaleOrdinal()
  .domain(["0-10", "10-100", "100-1000", "1000+"])
  .range([3, 4, 5, 6]);

var flowerSizeScale = 0.25;
var petalScale = d3.scaleOrdinal()
	.domain(['0-25', '25-50', '50-75', '75-100'])
	.range(_.range(4));
//var petalColors = d3.scaleOrdinal()
	//.range(['#FFB09E', '#CBF2BD', '#AFE9FF', '#FFC8F0', '#FFF2B4']);
var petalColors = ["none", "#6e6b6a"];
var indivPetalColors = d3.scaleOrdinal()
  .range(['#FFB09E', '#CBF2BD', '#AFE9FF', '#FFC8F0', '#FFF2B4']);

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
      if (laureate.age < 50) {
        if (laureate.age < 25){
          laureate.ageBucket = "0-25";
        }
        else{
          laureate.ageBucket = "25-50";
        }
      }
      else {
        if (laureate.age < 75) {
          laureate.ageBucket = "50-75";
        }
        else {
          laureate.ageBucket = "75-100";
        }
      }

      //Number of publications
      laureate.numPublications = parseInt(laureate.numPublications);
      if (laureate.numPublications < 10) {
          laureate.numPubBucket = "0-10";
      }
      else if (laureate.numPublications < 100) {
          laureate.numPubBucket = "10-100";
      }
      else if (laureate.numPublications < 1000) {
          laureate.numPubBucket = "100-1000";
      }
      else {
          laureate.numPubBucket = "1000+";
      }

      laureate.collaborate = parseInt(laureate.collaborate);
      laureate.mobility = parseInt(laureate.mobility);

      return laureate;
    }).sortBy(function(laureate) {
    	return -laureate.year
    }).value();

  // number of petals depending on number of publications
  var minPubs = d3.min(laureates, function(d) {return d.numPublications});
  var maxPubs = d3.max(laureates, function(d) {return d.numPublications});
  //numPetalScale.domain([minPubs, maxPubs]);
  console.log("Min # pubs: " + minPubs);
  console.log("Max # pubs: " + maxPubs);
  // overall flower size from rating
  var minAge = d3.min(laureates, function(d) {return d.age});
  var maxAge = d3.max(laureates, function(d) {return d.age});
  console.log("Min age: " + minAge);
  console.log("Max age: " + maxAge);
  console.log(laureates.length);
  // flowerSizeScale.domain([minRating, maxRating]);
  // get the top 4 genres by count
  topFields = _.chain(laureates)
  	.map('field').flatten()
  	.countBy().toPairs()
  	.sortBy(1).map(0)
  	.takeRight(4)
  	.value();
  topFields.push('Other');
  //petalColors.domain(topFields);
  // get all the years
  var allYears = _.chain(laureates)
  	.map('year').uniq().value();
  
  /*****************************************************
  ** build legend
  ******************************************************/

  var fontSize = 12;
  var legendWidth = 1000;
  
  console.log(legend);
  // petal shapes
  var legendPetalShapes = legend.append('g')
    // .attr('transform', 'translate(' + (legendWidth / 2) + ',0)')
    .selectAll('g')
    .data(['0-25', '25-50', '50-75', '75-100'])
    .enter().append('g')
    .attr('transform', function(d, i) {
      var x = i * (flowerSize / 3)+50;
      return 'translate(' + [x, 0] + ')'
    });
  legendPetalShapes.append('path')
    .attr('fill', 'none')
    .attr('stroke', strokeColor)
    .attr('stroke-width', 4)
    .attr('d', function(rating) {
      return petalPathsLegend[petalScale(rating)];
    })
    .attr('transform', 'scale(0.3)');
  
  legendPetalShapes.append('text')
    .attr('y', flowerSize/4)
    .attr('text-anchor', 'middle')
    .attr('fill', strokeColor)
    .style('font-size', fontSize + 'px')
    .text(function(d) {return d });
  
  legendPetalShapes.append('text')
    .attr('y', flowerSize/4 + 20)
    .attr('text-anchor', 'middle')
    .attr('fill', strokeColor)
    .style('font-size', fontSize + 'px')
    .text(function(d) {return "years old" });
  
  // petal colors
  var legendPetalColors = legend.append('g')
    .selectAll('g').data(["chemistry", "medicine", "physics"])
    .enter().append('g')
    .attr('transform', function(d, i) {
      var x = i * (flowerSize / 3) + 75;
      return 'translate(' + [x, flowerSize/4 + 40] + ')';
    });
    legendPetalColors.append('path')
    .attr('fill', function(d, i) {return indivPetalColors(d) })
    .attr('stroke', strokeColor)
    .attr('stroke-width', 4)
    .attr('d', petalPathsLegend[0])
    .attr('transform', 'scale(0.3)');
    // .attr('transform', function(d, i) {
    //   var x = i * (flowerSize / 6) + 100;
    //   return 'translate(' + [x, flowerSize] + ')scale(0.5)';
    //});

    legendPetalColors.append('text')
    .attr('y', flowerSize/4)
    .attr('text-anchor', 'middle')
    .attr('fill', strokeColor)
    .style('font-size', fontSize + 'px')
    .text(function(d) {return d});

  //background colors
  var legendBgColors = legend.append('g')
    // .attr('transform',
   //        'translate(' + [legendWidth / 2, flowerSize * .9] + ')')
    .selectAll('g').data(["migrated"])
    .enter().append('g')
    .attr('transform', function(d, i) {
      var x = i * (flowerSize / 2-10) + 100;
      return 'translate(' + [x, flowerSize/4 + 130] + ')';
    });
    legendBgColors.append('circle')
    .attr('r', flowerSize / 8)
    .attr('fill', function(d, i) {return petalColors[i+1]})
    .style("filter", "url(#motionFilter)")
    .attr("transform", "scale(0.5)");
  
  legendBgColors.append('text')
    .attr('y', flowerSize/4-10)
    .attr('text-anchor', 'middle')
    .attr('fill', strokeColor)
    .style('font-size', fontSize  + 'px')
    .text(function(d) {return d});
  
  // number of petals in a flower
  var legendNumPetals = legend.append('g')
    // .attr('transform',
    //       'translate(' + [legendWidth / 2, flowerSize * .9 * 2] + ')')
    .selectAll('g')
    .data(["0-10", "10-100", "100-1000", "1000+"]).enter().append('g')
    .attr('transform', function(d, i) {
      var x = i * (flowerSize/3 + 5) + 40;
      return 'translate(' + [x, flowerSize/4 + 220] + ')scale(0.3)';
    });
  
  legendNumPetals.selectAll('path')
    .data(function(d) {
      var numPetals = numPetalScale(d);
      console.log(numPetals);
      var path = petalPaths[0];
      return _.times(numPetals, function(i) {
        return {
          angle: (360/numPetals) * i,
          path: path
        }
      });
    }).enter().append('path')
    .attr('stroke', strokeColor)
    .attr('stroke-width', 2 / .3)
    .attr('fill', "white")
    .attr('d', function(d) {return d.path.join(' ')})
    .attr('transform', function(d) {
      return 'rotate(' + [d.angle] + ')';
    });
  
  legendNumPetals.append('text')
    .attr('y', flowerSize - 20)
    .attr('text-anchor', 'middle')
    .attr('fill', strokeColor)
    .style('font-size', fontSize / .3 + 'px')
    .text(function(d) {
      return d;
    });

  legendNumPetals.append('text')
    .attr('y', flowerSize + 30)
    .attr('text-anchor', 'middle')
    .attr('fill', strokeColor)
    .style('font-size', fontSize / .3 + 'px')
    .text("publications");

  var legendLeaf = legend.append('g')
    // .attr('transform', 'translate(' + (legendWidth / 2) + ',0)')
    .selectAll('g')
    .data(['shared prize'])
    .enter().append('g')
    .attr('transform', function(d, i) {
      var x = 185;
      return 'translate(' + [x, flowerSize/4 + 140] + ')'
    });
  legendLeaf.selectAll('path')
    .data(function(d) {
      var leaves = [];
        leaves.push({
          scale: flowerSizeScale,
          angle: -120
        });
        leaves.push({
          scale: flowerSizeScale,
          angle: 120
        });
      return leaves;
    }).enter().append('path')
    .attr('stroke', '#555')
    .attr('stroke-width', function(d) {
      return 2 / d.scale;
    }).attr('fill', '#4AB56D')
    .attr('d', leaf.join(' '))
    .attr('transform', function(d) {
      return 'rotate(' + [d.angle] + ')scale(0.3)';
    });

  legendLeaf.append('text')
    .attr('y', flowerSize/4-20)
    .attr('text-anchor', 'middle')
    .attr('fill', strokeColor)
    .style('font-size', fontSize + 'px')
    .text("shared prize");

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
    && fieldsInclude.indexOf(d.field[0]) >=0)
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

    var size = flowers.filter((d, i) => filterFunction(d, i, true, age_vals, pub_vals, year_vals, fieldsInclude)).size();
    var total = flowers.size();
    console.log("Showing: " + size);
    console.log("Total: " + total);
    texthowmany.innerText = "Displaying " + size + " out of " + total + " laureates";

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
    }).on('click', handleClick )
    .on("mouseover", handleMouseOver)
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
          fill: petalColors[d.mobility]
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
      var numPetals = numPetalScale(d.numPubBucket);
      // var numPetals = d.numPublications;
      var path = petalPaths[petalScale(d.ageBucket)];
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
        return indivPetalColors(d.field) 
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
      if (d.collaborate === 1) {
        leaves.push({
          scale: flowerSizeScale,
          angle: -120
        });
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