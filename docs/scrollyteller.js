// Code Source: https://bl.ocks.org/baronwatts/raw/2a50ae537d7c46670aa5eb30254ef751/
//svg
let svg = d3.select("#viz");
var strokeColor = '#444';
var flowerSize = 200;

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
var flowerSizeScale = d3.scaleLinear()
  .range([.05, .5]);
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
  .attr("id", "motionFilter")   //Give it a unique ID
  .attr("width", "300%")    //Increase the width of the filter region to remove blur "boundary"
  .attr("height", "300%")
  .attr("x", "-100%")       //Make sure the center of the "width" lies in the middle of the element
  .attr("y", "-100%")
  .append("feGaussianBlur") //Append a filter technique
  .attr("in", "SourceGraphic")  //Perform the blur on the applied element
  .attr("stdDeviation", "8 8"); //Do a blur of 8 standard deviations in the horizontal and vertical direction


//svg width and height
svg.attr('width',500)
    .attr('height',500)


//set up grid spacing
let spacing = 40;
let rows = 10;
let column = 10;
let randnum = (min,max) => Math.round( Math.random() * (max-min) + min );



//Create an array of objects
let our_data = Array({"name": "David J. Thouless", "numPublications": 51, "lastName": "Thouless", "field": ["physics"], "age": 82, "year": "2016"});
// console.log(our_data)

//create group and join our data to that group
let group = svg.selectAll('g')
  .data(our_data)
  .enter()
  .append("g")
  .classed('flower', true)
  .attr('transform', 'translate(' + 200 + ',' + 200 + ');')
  .on('click', function(d) {
      window.open('http://nobelprize.org/prizes/' + d.field[0] +  '/' + d.year + '/' + d.lastName);
  });

//create rectangles
let rects = group.append("circle")

//petals
let petals = group.selectAll('path.petal')
    .data(function(d) {
      // var numPetals = numPetalScale(d.numPublications);
      var numPetals = 5;
      var path = petalPaths[petalScale(d.field[0])];
      return _.times(numPetals, function(i) {
        return {
          scale: flowerSizeScale(d.age),
          angle: (360/numPetals) * i,
          path: path,
          field: d.field[0]
        }
      });
    }).enter().append('path')
      .classed('petal', true)
    .attr('opacity', "0")
    .attr('stroke', strokeColor)
    .attr('stroke-width', function(d) {
      return 2 / flowerSizeScale(d.age);
    }).attr('fill', function(d) {
        return petalColors(d.field) 
    })
    .attr('d', function(d) {return d.path.join(' ')})
    .attr('transform', function(d) {
      var cx = flowerSize / 2 / d.scale + 200;
      var cy = flowerSize / 2 / d.scale + 150;
      return 'translate(' + [cx, cy] +
        ')rotate(' + [d.angle] + ')';
    });

//leaves
// draw the leaves
let leaves = group.selectAll('path.leaf')
    .data(function(d) {
      var leaves = [];
      if (1) {
        leaves.push({
          scale: flowerSizeScale(d.age),
          angle: -120
        });
      }
      if (1) {
        leaves.push({
          scale: flowerSizeScale(d.age),
          angle: 120
        });
      }
      return leaves;
    }).enter().append('path')
    .classed('leaf', true)
    .attr('opacity', "0")
    .attr('stroke', '#555')
    .attr('stroke-width', function(d) {
      return 2 / flowerSizeScale(d.age);
    }).attr('fill', '#4AB56D')
    .attr('d', leaf.join(' '))
    .attr('transform', function(d) {
      var cx = flowerSize / 2 / d.scale + 200;
      var cy = flowerSize / 2 / d.scale + flowerSize + 100;
      return 'translate(' + [cx, cy] +
        ')rotate(' + [d.angle] + ')';
    });

//square grid
let grid = () =>{
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(600)
    .ease(d3.easeElastic)
    .attr("width", 100)
    .attr("height", 100)
    //.attr("rx", "50%")
    .attr("r", flowerSize/2)
    .attr("cy", "50%")
    .attr("x", (d, i) => 100 + i % column * spacing)
    .attr("y", (d, i) => 100 + Math.floor(i / 10) % rows * spacing)
    .attr("fill", (d) => { console.log(d); return petalColors(d.field[0]) } )
    .attr("opacity", "1")
    .style("filter", "url(#motionFilter)")
    .attr('transform', function(d, i) {
      return 'translate(' + [205, -100] + ')'});
  var petal = petals.filter(function(d, i) { return i == 0 })
    petal
    .transition()
    .delay((d, i) => 10 * i)
    .duration(600)
    .ease(d3.easeLinear)
    .attr('opacity', "0")
};



//circle grid
let grid2 = () =>{
    var petal = petals.filter(function(d, i) { return i == 0 })
    petal
    .transition()
    .delay((d, i) => 10 * i)
    .duration(600)
    .ease(d3.easeLinear)
    .attr('opacity', "1");

    var other_petals = petals.filter(function(d, i) { return i !== 0 })
    other_petals
    .transition()
    .delay((d, i) => 10 * i)
    .duration(600)
    .ease(d3.easeLinear)
    .attr('opacity', "0");

}


//divide
let divide = () =>{
  //draw all flower petals
  petals
    .transition()
    .delay((d, i) => 10 * i)
    .duration(600)
    .ease(d3.easeLinear)
    .attr('opacity', "1");
  leaves
    .transition()
    .delay((d, i) => 10 * i)
    .duration(600)
    .ease(d3.easeLinear)
    .attr('opacity', "0");
}


//bar cart
let barChart = () => {
    leaves
    .transition()
    .delay((d, i) => 10 * i)
    .duration(600)
    .ease(d3.easeLinear)
    .attr('opacity', "1")
  
}




//waypoints scroll constructor
function scroll(n, offset, func1, func2){
  return new Waypoint({
    element: document.getElementById(n),
    handler: function(direction) {
       direction == 'down' ? func1() : func2();
    },
    //start 75% from the top of the div
    offset: offset
  });
};



//triger these functions on page scroll
new scroll('div2', '75%', grid2, grid);
new scroll('div4', '75%', divide, grid2);
new scroll('div6', '75%', barChart, divide);



//start grid on page load
grid();
