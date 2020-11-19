var display_graph = function(){
    var graph;
      var button = document.getElementById("show_result");
      var scrapping_graph_progress = document.getElementById("scrapping_graph_progress");
      var remove_all = async function(){
          d3.select("svg").remove();
          return;
      };
  
  
      var myGraph = function () {
  
        // Add and remove elements on the graph object
        this.addNode = function (id) {
            nodes.push({"id": id});
            update();
        };
  
        this.removeNode = function (id) {
            var i = 0;
            var n = findNode(id);
            while (i < links.length) {
                if ((links[i]['source'] == n) || (links[i]['target'] == n)) {
                    links.splice(i, 1);
                }
                else i++;
            }
            nodes.splice(findNodeIndex(id), 1);
            update();
        };
  
        this.removeLink = function (source, target) {
            for (var i = 0; i < links.length; i++) {
                if (links[i].source.id == source && links[i].target.id == target) {
                    links.splice(i, 1);
                    break;
                }
            }
            update();
        };
  
        this.removeallLinks = function () {
            links.splice(0, links.length);
            update();
        };
  
        this.removeAllNodes = function () {
            nodes.splice(0, links.length);
            update();
        };
  
        this.addLink = function (source, target, value) {
            let source_obj = findNode(source);
            let target_obj = findNode(target);
            let distance_value = (Math.floor(Math.random() * 31) + 5);
            links.push({"source": source_obj, "target":target_obj, "value": distance_value});
            update();
        };
  
        var findNode = function (id) {
            for (var i in nodes) {
                if (nodes[i]["id"] === id) {
                    return nodes[i];
                }
                
            }
            return {};
        };
  
        var findNodeIndex = function (id) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id == id) {
                    return i;
                }
            }
        };
  
        // set up the D3 visualisation in the specified element
        var w = 960,
                h = 1000;
  
  
        var vis =  d3.select("#display_linking")
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                .attr("id", "svg")
                .attr("pointer-events", "all")
                .attr("viewBox", "0 0 " + w + " " + h)
                .attr("perserveAspectRatio", "xMinYMid")
                .append('svg:g');
  
        var force = d3.layout.force();
  
        var nodes = force.nodes(),
            links = force.links();
  
        var update = function () {
            var link = vis.selectAll("line")
                    .data(links, function (d) {
                        return d.source.id + "-" + d.target.id;
                    });
  
            link.enter().append("line")
                    .attr("id", function (d) {
                        return d.source.id + "-" + d.target.id;
                    })
                    .attr("stroke-width", function (d) {
                        return d.value / 10;
                    })
                    .attr("class", "link");
            link.append("title")
                    .text(function (d) {
                        return d.value;
                    });
            link.exit().remove();
  
            var node = vis.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id;
                    });
  
            var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .call(force.drag);
  
            nodeEnter.append("svg:circle")
                    .attr("r", 4.5)
                    .attr("id", function (d) {
                        return "Node;" + d.id;
                    })
                    .attr("class", "nodeStrokeClass")
  
            nodeEnter.append("svg:text")
                    .attr("x", 14)
                    .attr("y", ".31em")
                    .text(function (d) {
                        return d.id;
                    });
  
            node.exit().remove();
  
            force.on("tick", function () {
  
                node.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
  
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
            });
  
            // Restart the force layout.
            force
                .gravity(.01)
                .charge(-1000000)
                .friction(0)
                .linkDistance( function(d) { return d.value * 10 } )
                .size([w, h])
                .start();
        };
  
  
        // Make it all go
        update();
    };
  
      var keepNodesOnTop = function () {
          document.querySelectorAll(".nodeStrokeClass").forEach(function( circle ) {
              var gnode = circle.parentNode;
              gnode.parentNode.appendChild(gnode);
          });
      };
  
        var start = function(){
          graph = new myGraph("#svgdiv");
          var data = scrap_obj.get_data();
          data.nodes.forEach(function(node){
              graph.addNode(node.name);
          });
  
          keepNodesOnTop();
  
          // callback for the changes in the network
          let links = data.links;
          for(var i = 0; i<links.length;i++){
              let link = links[i];
              let source = link.source;
              let target = link.target;
              (function(source, target,i){
                  
                  setTimeout(function(){
                      graph.addLink(source, target);
                      keepNodesOnTop();
                      }
                  , 100*i);
              })(source, target,i);  
          }
        }
  
      var display = function(){ 
        button.disabled = true ;
        scrapping_graph_progress.style.display = "block";
        start();
    
        
      };
  
      var on_load = function(){
          var text = button.textContent.trim();
          if(text == "Show the Result"){
              display();
              button.textContent = "Hide the Result";
          }
          else{
              remove_all();
              button.textContent = "Show the Result";
          }
  
      };
      return{
          on_load: on_load,
          remove_all:remove_all
      };
  
  }();
  
  document.getElementById("show_result").addEventListener("click", display_graph.on_load);
  document.getElementById("scrapping_button").addEventListener("click", display_graph.remove_all);
  