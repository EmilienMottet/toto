
function drawQueryAST(uniqueId, container, json, displayOptions)
{
	if(container==null || json==null)
		return;

    //draw
    var debugqueryastdrawdiv = $('<div />').addClass("debugqueryastdrawdiv").attr("id", "debugqueryastdrawdiv-" + uniqueId);
    var debugqueryastclose = $('<div />').addClass("astbutton").addClass("astclosebutton").click(function(){ queryRemoveExplain(uniqueId); return false;});
    var debugqueryastdecrement = $('<div />').addClass("astbutton").addClass("astdecdistbutton");
    var debugqueryastincrement = $('<div />').addClass("astbutton").addClass("astincdistbutton");
    //tooltips
    debugqueryastclose.append($('<span />').html('Close'));
    debugqueryastdecrement.append($('<span />').html('Decrease vertical spacing'));
    debugqueryastincrement.append($('<span />').html('Increase vertical spacing'));
    //add elements
    debugqueryastdrawdiv.append(debugqueryastclose);
    debugqueryastdrawdiv.append(debugqueryastdecrement);
    debugqueryastdrawdiv.append(debugqueryastincrement);
    container.append(debugqueryastdrawdiv);
    
    var st = new $jit.ST( {
        injectInto: "debugqueryastdrawdiv-" + uniqueId,
        constrained: false,
        levelsToShow: 100,
        orientation: 'top',
        align:'top',
        subtreeOffset: 8,
        siblingOffset: 5,
        duration: 200,
        transition: $jit.Trans.Quart.easeInOut,
        levelDistance: 60,
        Navigation: {
          enable:true,
          panning:true,
        },
        Node: {
            autoHeight: true,
            autoWidth: true,
            type: 'rectangle',
            overridable: true
        },
        Label: {
            overridable: true,
            type: 'HTML',
        },
        Edge: {
            type: 'bezier',
            overridable: true
        },
        onCreateLabel: function(label, node){
            label.id = node.id + uniqueId;
            label.innerHTML = node.name;
        },
        onBeforePlotLine: function(adj){
          var lw = 2;
  		  if(displayOptions.lwFromContribution) {
	          var totalMatches = st.graph.getNode(st.root).data.nContributed;
	          if(totalMatches != null && totalMatches != 0) {
	          	lw = (16*adj.nodeTo.data.nContributed)/totalMatches;
	          }
	          if(lw<1) {
	        	  lw = 1;
	          }
  		  }
          adj.data.$lineWidth = lw;
          adj.data.$color = '#202020';
        }
    });
    //load json data
    st.loadJSON(json);
    //compute the tree labels
    st.graph.eachNode(function (node){
    	  node.data.$color = "#ffffff"; //UGLY: this simulates a transparent background
    	  //compute the label for this node
    	  node.name = "<table class=\"debugqueryastnodeelem"
    	  node.name += "\"><tr class=\"debugqueryastnodeelem\"><th class=\"debugqueryastnodeelem\"><b>" + node.data.type + "</b></th></tr>";
    	  if(node.data.arguments != null) {
    		if(displayOptions.args) {
	    	    node.name += "<tr class=\"debugqueryastnodeelem\"><td class=\"debugqueryastnodeelem\"><ul class=\"debugqueryastnodeelem\">";
	    	    for(i=0; i< node.data.arguments.length; i++) {
	    	      node.name += "<li class=\"debugqueryastnodeelem\">" + node.data.arguments[i] + "</li>";
	    	    }
	    	    node.name += "</ul></td></tr>";
    		}
    	    delete node.data.arguments;
    	  }
    	  if(node.data.options != null) {
    		if(displayOptions.opts) {
	    	    node.name += "<tr class=\"debugqueryastnodeelem\"><td class=\"debugqueryastnodeelem\"><ul class=\"debugqueryastnodeelem\">";
	    	    for(i=0; i< node.data.options.length; i++) {
	    	      node.name += "<li class=\"debugqueryastnodeelem\">" + node.data.options[i] + "</li>";
	    	    }
	    	    node.name += "</ul></td></tr>";
    		}
    	    delete node.data.options;
    	  }
    	  if(node.data.estCount != null) {
      		if(displayOptions.estCounts) {
  	    	    node.name += "<tr class=\"debugqueryastnodeelem\"><td class=\"debugqueryastnodeelem\">est. " + node.data.estCount + "</td></tr>";
      		}
      	    delete node.data.estCount;
      	  }
    	  if(node.data.nContributed != null) {
      		if(displayOptions.contribCounts) {
  	    	    node.name += "<tr class=\"debugqueryastnodeelem\"><td class=\"debugqueryastnodeelem\">contrib.  " + node.data.nContributed + "</td></tr>";
      		}
      	    //delete node.data.nContributed;
      	  }
    	  node.name += "</table>";
    	});
    //compute node positions and layout
    st.compute();
    //emulate a click on the root node.
    st.canvas.config.offsetY = (debugqueryastdrawdiv.height() / 2.0) - (st.graph.getNode(st.root).data.$height / 2.0 + 5);
    st.onClick(st.root);
    
    debugqueryastdecrement.click(function(){ 
    	st.canvas.config.levelDistance /= 1.2; 
    	st.refresh(); 
    	return false;
    	});
    debugqueryastincrement.click(function(){ 
    	st.canvas.config.levelDistance *= 1.2; 
    	st.refresh(); 
    	return false;
    	});
}
