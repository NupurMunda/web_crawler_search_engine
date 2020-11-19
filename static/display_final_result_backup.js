var display_graph = function(){
    var button = document.getElementById("show_result");
    var remove_all = async function(){
        d3.select("svg").remove();
        await fetch("/remove-file");
        return;
    };
    root = scrap_obj.get_data();

    

    function start() {
        var width = 960,
            height = 1000,
            radius = 4.5,
            node,
            link,
            root,
            cell,
            label,
            count = 0;

  
        var force = d3.layout.force()
            .on("tick", tick)
            .charge(-120)
            .linkDistance(30)
            .gravity(0.1)
            .size([width, height - 60]);
  
        var svg = d3.select("#display_linking").append("svg")
            .attr("width", width)
            .attr("height", height);

        var voronoi = d3.geom.voronoi()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .clipExtent([[0, 0], [width, height]]);
  
        
        root.fixed = true;
        root.x = width / 2;
        root.y = height / 2 - 80;
        update();
        //console.log("JsonObject2" + data)

        function update() {
  
            var nodes = root.nodes,
            links = root.links;
  
          // Restart the force layout.
            force
                .nodes(nodes)
                .links(links)
                .start();
  
            link = svg.selectAll(".link")
                .data(links);
  
          // Enter any new links.
          link.enter().insert("svg:line", ".node")
            .attr("class", "link");
            // .attr("x1", function(d) {
            //   return d.source.x;
            // })
            // .attr("y1", function(d) {
            //   return d.source.y;
            // })
            // .attr("x2", function(d) {
            //   return d.target.x;
            // })
            // .attr("y2", function(d) {
            //   return d.target.y;
            // });

  
          // Exit any old links.
          link.exit().remove();
  
          // Update the nodes…
          node = svg.selectAll("circle.node")
            .data(nodes, function(d) {
              return d.name;
            });
            //.style("fill", color);
  
          node.transition()
            .attr("r", radius);
  
  
          // Enter any new nodes.
          node.enter().append("svg:circle")
            .attr("class", "node")
            .attr("cx", function(d) {
              return d.x;
            })
            .attr("cy", function(d) {
              return d.y;
            })
            .attr("r", radius)
            .attr("class", "node")
            .call(force.drag);  
          // Exit any old nodes.
          node.exit().remove();

        label = node.append("svg:text")
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

        cell = node.append("path")
        .attr("class", "cell");
  
  
        //   title = svg.selectAll("text.title")
        //     .data(nodes);
  
        //   // Enter any new titles.
        //   title.enter()
        //     .append("text")
        //     .attr("class", "title");
        //   //.text(function(d) { return d.name; });
  
        //   // Exit any old titles.
        //   title.exit().remove();
        }
  
        function tick() {
            cell
                .data(voronoi(root.nodes))
                .attr("d", function(d) { return d.length ? "M" + d.join("L") : null; });

            link
                .attr("x1", function(d) { 
                return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            label
                .attr("x", function(d) { return d.x + 7; })
                .attr("y", function(d) { return d.y; });
        }
  
        // Toggle children on click.
        function click(d) {
          document.getElementById("username").innerHTML = "Username:" + d.name;
          document.getElementById("id").innerHTML = "ID:" + d.id;
          document.getElementById("friends").innerHTML = d.friend;
          document.getElementById("nodeTitle").innerHTML = "";
          //document.getElementById("id").innerHTML = "Friend Count:" + d.name;
          //if (d._children)
          //grabImage();
          //document.getElementById("image").innerHTML = (d.image);
  
          /*if (d.children) { 
                  d._children = d.children;
                  d.children = null;
              } else {
                  d.children = d._children;
                  d._children = null;
              }
              update();*/
        }
  
        function mouseover() {
          d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 16);
        }
  
  
        function mouseout() {
          d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 8);
        }
  
        // Returns a list of all nodes under the root.
        function flatten(root) {
          var nodes = [],
            i = 0;
  
          function recurse(node) {
            if (node.children) node.size = node.children.reduce(function(p, v) {
              return p + recurse(v);
            }, 0);
            if (!node.id) node.id = ++i;
            nodes.push(node);
            return node.size;
          }
  
          root.size = recurse(root);
          return nodes;
  
        }
      }

    var display = function(){
    //     var div = d3.select("#display_linking");
    //     console.log(div);
    //     var width = 960,
    //     height = 1000;
    // // appending the svg to body

    // var svg = d3.select("#display_linking")
    // .append("svg:svg")
    //     .attr("width", width)
    //     .attr("height", height);
    // // adding force to the svg
    // console.log(d3.layout);   
  
      start();
  
      
    };

    var on_load = function(){
        var text = button.textContent.trim();
        if(text == "Show the Process"){
            display();
            button.textContent = "hide";
        }
        else{
            remove_all();
            button.textContent = "Show the Process";
        }

    };
    return{
        on_load: on_load
    };

}();

document.getElementById("show_result").addEventListener("click", display_graph.on_load);
