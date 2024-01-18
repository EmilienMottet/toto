
function explainmatch(containerId, json, options){
	$("#"+containerId).find("a.toggleExplain").click(function() {
		$(this).hide();
		drawAST(containerId, $("#"+containerId).find("div.explainMatchContainer"), json, options );
		return false;
	});
	
	if(options.expanded) {
		$("#"+containerId).find("a.toggleExplain").trigger('click');
	}
}

function matchRemoveExplain(widgetCssId) {
	var w = jQuery("#" + widgetCssId);
	w.find("a.toggleExplain").show();
	w.find("div.explainMatchContainer").empty();
}

function drawAST(uniqueId, container, json, displayOptions)
{
	if(container==null || json==null)
		return;

    //draw
    var debugastdrawdiv = $('<div />').addClass("debugastdrawdiv").attr("id", "debugastdrawdiv-" + uniqueId);
    var debugastclose = $('<div />').addClass("astbutton").addClass("astclosebutton").click(function(){ matchRemoveExplain(uniqueId); return false;});
    var debugastdecrement = $('<div />').addClass("astbutton").addClass("astdecdistbutton");
    var debugastincrement = $('<div />').addClass("astbutton").addClass("astincdistbutton");
    //tooltips
    debugastclose.append($('<span />').html('Close'));
    debugastdecrement.append($('<span />').html('Decrease vertical spacing'));
    debugastincrement.append($('<span />').html('Increase vertical spacing'));
    //add elements
    debugastdrawdiv.append(debugastclose);
    debugastdrawdiv.append(debugastdecrement);
    debugastdrawdiv.append(debugastincrement);
    container.append(debugastdrawdiv);
    
    var st = new $jit.ST( {
        injectInto: "debugastdrawdiv-" + uniqueId,
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
          panning:true
        },
        Node: {
            autoHeight: true,
            autoWidth: true,
            type: 'rectangle',
            overridable: true
        },
        Label: {
            overridable: true,
            type: 'HTML'
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
          if (adj.nodeFrom.data.docId == adj.nodeTo.data.docId && adj.nodeFrom.data.docId == adj.nodeFrom.data.rootDid) {
              adj.data.$color = "#00b000";
              adj.data.$lineWidth = 2;
          }
          else {
              adj.data.$color = "#b00000";
              adj.data.$lineWidth = 2;
          }
        }
    });
    //load json data
    st.loadJSON(json);
    //compute the tree labels
    rootDid = st.graph.getNode(st.root).data.docId;
    st.graph.eachNode(function (node){
    	  node.data.rootDid = rootDid;
    	  node.data.$color = "#ffffff"; //UGLY: this simulates a transparent background
    	  //compute the label for this node
    	  node.name = "<table class=\"debugastnodeelem"
    	  if (node.data.docId == node.data.rootDid) {
    		  node.name += " matching";
    	  } else {
    		  node.name += " notMatching"
    	  }
    	  node.name += "\"><tr class=\"debugastnodeelem\"><th class=\"debugastnodeelem\"><b>" + node.data.type + "</b> - did: " + node.data.docId + "</th></tr>";
    	  if(node.data.arguments != null) {
    		if(displayOptions.args) {
	    	    node.name += "<tr class=\"debugastnodeelem\"><td class=\"debugastnodeelem\"><ul class=\"debugastnodeelem\">";
	    	    for(i=0; i< node.data.arguments.length; i++) {
	    	      node.name += "<li class=\"debugastnodeelem\">" + node.data.arguments[i] + "</li>";
	    	    }
	    	    node.name += "</ul></td></tr>";
    		}
    	    delete node.data.arguments;
    	  }
    	  if(node.data.positions != null) {
    		if(displayOptions.pos) {
    			node.name += "<tr class=\"debugastnodeelem\"><td class=\"debugastnodeelem\"> Pos: " + node.data.positions + "</td></tr>";
    		}
    	    delete node.data.positions;
    	  }
    	  if(node.data.options != null) {
    		if(displayOptions.opts) {
	    	    node.name += "<tr class=\"debugastnodeelem\"><td class=\"debugastnodeelem\"><ul class=\"debugastnodeelem\">";
	    	    for(i=0; i< node.data.options.length; i++) {
	    	      node.name += "<li class=\"debugastnodeelem\">" + node.data.options[i] + "</li>";
	    	    }
	    	    node.name += "</ul></td></tr>";
    		}
    	    delete node.data.options;
    	  }
    	  if(node.data.rankings != null) {
    		if(displayOptions.rankings) {
	    	    node.name += "<tr class=\"debugastnodeelem\"><td class=\"debugastnodeelem\"><ul class=\"debugastnodeelem\">";
	    	    for(i=0; i< node.data.rankings.length; i++) {
	    	      node.name += "<li class=\"debugastnodeelem\">" + node.data.rankings[i] + "</li>";
	    	    }
	    	    node.name += "</ul></td></tr>";
    		}
    	    delete node.data.rankings;
    	  }
    	  node.name += "</table>";
    	});
    //compute node positions and layout
    st.compute();
    //emulate a click on the root node.
    st.canvas.config.offsetY = (debugastdrawdiv.height() / 2.0) - (st.graph.getNode(st.root).data.$height / 2.0 + 5);
    st.onClick(st.root);
    
    debugastdecrement.click(function(){ 
    	st.canvas.config.levelDistance /= 1.2; 
    	st.refresh(); 
    	return false;
    	});
    debugastincrement.click(function(){ 
    	st.canvas.config.levelDistance *= 1.2; 
    	st.refresh(); 
    	return false;
    	});
}
