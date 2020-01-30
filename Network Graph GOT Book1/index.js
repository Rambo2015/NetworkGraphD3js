//Constants for the SVG
var width = 800,
    height = 700;

//Set up the colour scale
var color = d3.scale.category20();

//Set up the force layout
var force = d3.layout.force()
    .charge(-120)
    .linkDistance(100)
    .size([width, height]);

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//Read the data from the mis element 
d3.json('GoTbook1.json', function (data) {
    var groupOne = data.nodes.filter(f => f.group == 1)
    var name = (data.nodes.map(f => f.name))
    console.log(data.links[0].value)
    var linkOne = (data.links.filter(f => f.value <= 3))


    force.nodes(data.nodes)
        .links(data.links)
        .start();

    var link = svg.selectAll(".link")
        .data(data.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function (d) {
            return Math.sqrt(d.value);
        });

    var node = svg.selectAll(".node")
        .data(data.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    node.append("circle")
        .attr("r", 3)
        .style("fill", function (d) {
            return color(d.group);
        })

    node.append("text")
        .attr("dx", 10)
        .attr("dy", ".35em")
        .text(function (d) { return d.name });

    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        //Changed

        d3.selectAll("circle").attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
                return d.y;
            });

        d3.selectAll("text").attr("x", function (d) {
            return d.x;
        })
            .attr("y", function (d) {
                return d.y;
            });

        //End Changed

    });

}
)

//Creates the graph data structure out of the json data
// force.nodes(graph.nodes)
//     .links(graph.links)
//     .start();

// //Create all the line svgs but without locations yet
// var link = svg.selectAll(".link")
//     .data(graph.links)
//     .enter().append("line")
//     .attr("class", "link")
//     .style("stroke-width", function (d) {
//         return Math.sqrt(d.value);
//     });

// //Do the same with the circles for the nodes - no 
// //Changed
// var node = svg.selectAll(".node")
//     .data(graph.nodes)
//     .enter().append("g")
//     .attr("class", "node")
//     .call(force.drag);

// node.append("circle")
//     .attr("r", 8)
//     .style("fill", function (d) {
//         return color(d.group);
//     })

// node.append("text")
//     .attr("dx", 10)
//     .attr("dy", ".35em")
//     .text(function (d) { return d.name });
// //End changed


// //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
// force.on("tick", function () {
//     link.attr("x1", function (d) {
//         return d.source.x;
//     })
//         .attr("y1", function (d) {
//             return d.source.y;
//         })
//         .attr("x2", function (d) {
//             return d.target.x;
//         })
//         .attr("y2", function (d) {
//             return d.target.y;
//         });

//     //Changed

//     d3.selectAll("circle").attr("cx", function (d) {
//         return d.x;
//     })
//         .attr("cy", function (d) {
//             return d.y;
//         });

//     d3.selectAll("text").attr("x", function (d) {
//         return d.x;
//     })
//         .attr("y", function (d) {
//             return d.y;
//         });

//     //End Changed

// });

