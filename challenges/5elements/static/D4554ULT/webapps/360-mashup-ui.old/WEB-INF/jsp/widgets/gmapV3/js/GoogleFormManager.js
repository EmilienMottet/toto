

GoogleFormManager = function (gMapWidget) {
	this.polygons_ = [];
	this.circles_ = [];
	this.geoFacets_ = [];
	this.ctx_ = new exa.util.Context(this);
		
	this.polygonOptions = {
		fillColor: '#001871',
		fillOpacity:0.4,
		strokeWeight: 1,
		zIndex: 1,
		editable: true
	};
	this.circleOptions = {
		fillColor: '#001871',
		fillOpacity:0.4,
		strokeWeight: 1,
		zIndex: 1,
		editable: true
	};
	this.facetOptions = {
		fillColor: '#001871',
		fillOpacity:0.8,
		strokeWeight: 0,
		strokeColor: '#666',
		zIndex: 1
	};
	
	gMapWidget.addObserverForKey(this, 'map');
};

GoogleFormManager.prototype.enableHeatmap_ = false;

GoogleFormManager.prototype.setEnableHeatmap = function (enabled) {
	this.enableHeatmap_ = !!enabled;
};

GoogleFormManager.prototype.observeValueForKey = function (key, obj) {
	switch (key) {
	case 'map':
		this.map = obj.getMap();
		var i;
		for (i = 0; i < this.polygons_.length; i ++) {
			this.polygons_[i].setMap(this.map);
		}
		for (i = 0; i < this.circles_.length; i ++) {
			this.circles_[i].setMap(this.map);
		}
		for (i = 0; i < this.geoFacets_.length; i ++) {
			this.geoFacets_[i].setMap(this.map);
		}
		
		if (this.heatMap_) {
			this.heatMap_.setMap(this.map);
		}
		
		google.maps.event.addListener(this.map, 'mouseover', this.ctx_.f(function (e) {
			var div = this.map.getDiv();		
			if (this.editable &&
				e.pixel.x > 0 && e.pixel.x < div.offsetWidth &&
				e.pixel.y > 0 && e.pixel.y < div.offsetHeight) {				
				this.enableEdition();
			}
		}));
		
		google.maps.event.addListener(this.map, 'mouseout', this.ctx_.f(function (e) {
			var div = this.map.getDiv();
			if (this.editable &&
				e.pixel.x <= 0 || e.pixel.x >= div.offsetWidth ||
				e.pixel.y <= 0 || e.pixel.y >= div.offsetHeight - 20) {// 20px because there are no mouseout over the copyrights...
				this.disableEdition();
			}
		}));
		this.fitForms();
		
		if (this.legend_) {
			this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.legend_);
		}
		
		if (this.tooltip_) {
			this.tooltip_.setMap(this.map);
		}
		
		break;
	}	
};

GoogleFormManager.prototype.setEditable = function (enabled) {
	this.editable = enabled;
};

GoogleFormManager.prototype.enableEdition = function () {	
	if (!this.drawingManager_) {
		this.drawingManager_ = new google.maps.drawing.DrawingManager({
			drawingMode: null,
			drawingControl: true,				
			drawingControlOptions: {
				position: google.maps.ControlPosition.TOP_CENTER,
				drawingModes: [
					google.maps.drawing.OverlayType.POLYGON,
					google.maps.drawing.OverlayType.CIRCLE
				]
			},
			polygonOptions: this.polygonOptions,
			circleOptions : this.circleOptions 
		});
	    	    
	    google.maps.event.addListener(this.drawingManager_, 'polygoncomplete', this.ctx_.f(this.addPolygon));
	    google.maps.event.addListener(this.drawingManager_, 'circlecomplete',  this.ctx_.f(this.addCircle));
	}
	
	if (this.map) {
		this.drawingManager_.setMap(this.map);		
	}
	
	var i;
	for (i = 0; i < this.polygons_.length; i ++) {
		this.polygons_[i].setEditable(true);
	}	
	for (i = 0; i < this.circles_.length; i ++) {
		this.circles_[i].setEditable(true);
	}
};

GoogleFormManager.prototype.disableEdition = function() {
	if (this.drawingManager_) {
		this.drawingManager_.setMap(null);
	}
	
	var i;
	for (i = 0; i < this.polygons_.length; i ++) {
		this.polygons_[i].setEditable(false);
	}	
	for (i = 0; i < this.circles_.length; i ++) {
		this.circles_[i].setEditable(false);
	}	
};


GoogleFormManager.prototype.addPolygon = function(polygon, fromInterface) {
	this.polygons_.push(polygon);
	var dispatchFunc = this.ctx_.f(this.dispatch);	
	polygon.getPaths().forEach(function (path) {
		google.maps.event.addListener(path, 'insert_at', dispatchFunc);
		google.maps.event.addListener(path, 'remove_at', dispatchFunc);
		google.maps.event.addListener(path, 'set_at', dispatchFunc);
	});
	
	google.maps.event.addListener(polygon, 'rightclick', this.ctx_.f(function() {
		if (this.editable) {
			this.removePolygon(polygon);
		}
	}));
	
	if (fromInterface) {
		this.fitForms();
	} else {
		this.dispatch();
	}
};

GoogleFormManager.prototype.removePolygon = function(polygon) {
	polygon.setMap(null);
	var polygons = this.polygons_;
	for (var i = 0; i < polygons.length; i ++) {
		if (polygons[i] == polygon) {
			polygons.splice(i, 1);
			break;
		}
	}
	this.dispatch();
};

GoogleFormManager.prototype.addCircle = function(circle, fromInterface) {
	this.circles_.push(circle);
	var dispatchFunc = this.ctx_.f(this.dispatch);
	google.maps.event.addListener(circle, 'center_changed', dispatchFunc);
	google.maps.event.addListener(circle, 'radius_changed', dispatchFunc);	
	google.maps.event.addListener(circle, 'rightclick', this.ctx_.f(function() {
		if (this.editable) {
			this.removeCircle(circle);
		}
	}));
	
	if (fromInterface) {
		this.fitForms();
	} else {
		this.dispatch();
	}
};

GoogleFormManager.prototype.removeCircle = function(circle) {
	circle.setMap(null);
	var circles = this.circles_;
	for (var i = 0; i < circles.length; i ++) {
		if (circles[i] == circle) {
			circles.splice(i, 1);
			break;
		}
	}
	this.dispatch();
};

GoogleFormManager.prototype.setGeoInterface = function(geoInterface) {
	this.geoInterface_ = geoInterface;
};

GoogleFormManager.prototype.dispatch = function() {
	this.geoInterface_.triggerChanged();
};

GoogleFormManager.prototype.fitForms = function () {
	if (this.map && 
			(this.polygons_.length > 0 ||
			 this.circles_.length > 0 ||
			 this.geoFacets_.length > 0)) {
		var bounds = new google.maps.LatLngBounds(),
			i,
			geoFacet;
		for (i = 0; i < this.polygons_.length; i ++) {
			this.polygons_[i].getPaths().forEach(function (path) {
				path.forEach(function (latlng) {
					bounds.extend(latlng);
				});
			});
		}
		
		for (i = 0; i < this.circles_.length; i ++) {
			bounds.union(this.circles_[i].getBounds());
		}
		
		for (i = 0; i < this.geoFacets_.length; i ++) {
			geoFacet = this.geoFacets_[i];
			if (geoFacet instanceof google.maps.Polygon) {
				geoFacet.getPaths().forEach(function (path) {
					path.forEach(function (latlng) {
						bounds.extend(latlng);
					});
				});
			} else {
				bounds.union(geoFacet.getBounds());
			}
		}
		this.map.fitBounds(bounds);
	} else if (this.map && 
				this.enableHeatmap_ &&
				this.heatMap_ &&
				this.heatMap_.getData().getLength() > 0) {
		var bounds = new google.maps.LatLngBounds();
		this.getHeatMap().getData().forEach(function (point) {
			bounds.extend(point.location);
		});
		this.map.fitBounds(bounds);
	}
};

GoogleFormManager.prototype.addDiskFacet = function (lat, lng, radius, url, aggregation, legend) {
	var gmapCircle = new google.maps.Circle(this.facetOptions);
	gmapCircle.setCenter(new google.maps.LatLng(lat, lng));
	gmapCircle.setRadius(parseInt(radius));	
	this.addFacet_(gmapCircle, url, aggregation, legend);
};

GoogleFormManager.prototype.addPolygonFacet = function (path, url, aggregation, legend) {
	var latlngArr = [],
		split;
	for (var i = 0; i < path.length; i++) {
		split = path[i].split(',');
		latlngArr.push(new google.maps.LatLng(split[0], split[1]));
	}
	var gmapPolygon = new google.maps.Polygon(this.facetOptions);
	gmapPolygon.setPath(latlngArr);
	this.addFacet_(gmapPolygon, url, aggregation, legend);
};

GoogleFormManager.prototype.addBoundsFacet = function (min, max, url, aggregation, legend) {
	var bounds  = new google.maps.LatLngBounds();
	var split = min.split(',');
	bounds.extend(new google.maps.LatLng(split[0], split[1]));
	split = max.split(',');
	bounds.extend(new google.maps.LatLng(split[0], split[1]));
	
	if (this.enableHeatmap_) {
		this.getHeatMap().getData().push({ location: bounds.getCenter(), weight:aggregation });
	} else {
		var gmapRectangle = new google.maps.Rectangle(this.facetOptions);
		gmapRectangle.setBounds(bounds);
		this.addFacet_(gmapRectangle, url, aggregation, legend);
	}
};

GoogleFormManager.prototype.addFacet_ = function (form, url, aggregation, legend) {
	form.setEditable(false);
	form.setMap(this.map);
	form.set('aggregation', aggregation); 
	google.maps.event.addListener(form, 'click', function () {
		exa.redirect(url);
	});
	if (legend) {
		if (!this.tooltip_) {
			this.tooltip_ = new GoogleTooltip();
		}
		var tooltip = this.tooltip_;
		tooltip.setMap(this.map);
		
		google.maps.event.addListener(form, 'mouseover', function (e) {
			tooltip.setContent(legend);
			tooltip.setVisibility(true);
			form.setOptions({
				strokeWeight:2,
				zIndex:2
			});
		});	
		google.maps.event.addListener(form, 'mouseout', function (e) {
			tooltip.setVisibility(false);
			form.setOptions({
				strokeWeight:0,
				zIndex:1
			});
		});
		
		google.maps.event.addListener(form, 'mousemove', function (e) {
			tooltip.updatePosition(e.latLng);
		});	
	}
	this.geoFacets_.push(form);
};

GoogleFormManager.prototype.clearFacets = function () {
	for (var form; this.geoFacets_.length && (form = this.geoFacets_.pop()); ) {
		form.setMap(null);
	}
};

GoogleFormManager.prototype.computeFacetColors = function () {
	var geoFacets = this.geoFacets_,
		min,
		max,
		aggregation,
		i,
		diff,
		color,
		ptc;
	
	if (!this.enableHeatmap_ && geoFacets.length > 0) {
		min = Number.MAX_VALUE;
		max = Number.MIN_VALUE;
		for (i = 0; i < geoFacets.length; i ++) {
			aggregation = geoFacets[i].get('aggregation');
			if (min > aggregation) {
				min = aggregation;
			}
			if (max < aggregation) {
				max = aggregation;
			}
		}
		
		if (max > min) { 
			diff = max-min;
			for (i = 0; i < geoFacets.length; i ++) {
				ptc = (geoFacets[i].get('aggregation')-min)/diff;
				if (ptc == 1) {
					color = GoogleFormManager.COLORS[GoogleFormManager.COLORS.length-1];
				} else {
					color = GoogleFormManager.COLORS[Math.floor(ptc * GoogleFormManager.COLORS.length)];
				}
				geoFacets[i].setOptions({
					fillColor:color
				});
			}
			this.createLegend_(min, max);			
			if (this.map) {
				this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.legend_);
			}
		}		
	}
};

GoogleFormManager.prototype.createLegend_ = function (min, max) {
	var $legend,
		i;
	if (!this.legend_) {
		this.legend_ = document.createElement('div');			
	}
	$legend = $(this.legend_);	
	$legend.empty();
	$legend.css({
		padding:'3px',
		backgroundColor:'#fff',
		opacity:0.8
	});
	$legend.append('<div style="float:left;margin-right:3px;">'+min+'</div>');
	for (i = 0; i < GoogleFormManager.COLORS.length; i ++) {
		$legend.append('<div class="gmaps-legend-color" style="background-color:'+GoogleFormManager.COLORS[i]+';width:20px;height:20px;float:left;"></div>');		
	}
	$legend.append('<div style="float:left;margin-left:3px;">'+max+'</div>');
};

GoogleFormManager.COLORS = ['#f7dd80', '#f5c050', '#f1a239','#d36c2a','#9c1e21','#5d0501'];

GoogleFormManager.prototype.getHeatMap = function () {
	if (!this.heatMap_) {
		this.heatMap_ = new google.maps.visualization.HeatmapLayer();
		this.heatMap_.setMap(this.map);
	}
	return this.heatMap_;
};

/* Lazy load the class because we have to wait for google.maps.OverlayView */
GoogleTooltip = function () {	
	GoogleTooltip = function () {
	    this.ANCHOR_OFFSET_ = new google.maps.Point(12, 12);
	};	
	GoogleTooltip.prototype = new google.maps.OverlayView();
	GoogleTooltip.prototype.draw = function () {		
	};
	GoogleTooltip.prototype.onAdd = function () {
		this.node_ = this.createHtmlNode_();		
		this.setVisibility(false);
		this.getMap().controls[google.maps.ControlPosition.TOP].push(this.node_);
	};
	GoogleTooltip.prototype.onRemove = function () {		
	};
	
	GoogleTooltip.prototype.setVisibility = function (visible) {		
		this.node_.style.display = visible ? '' : 'none';
	};

	GoogleTooltip.prototype.setContent = function (content) {
		this.node_.innerHTML = content;
	};

	GoogleTooltip.prototype.createHtmlNode_ = function() {
		var divNode = document.createElement('div');
		divNode.className = 'gmaps-tooltip';
		divNode.style.position = 'absolute';
	    divNode.index = 100;
	    return divNode;
	};

	
	GoogleTooltip.prototype.updatePosition = function(latLng) {
	    var projection = this.getProjection();
	    var point = projection.fromLatLngToContainerPixel(latLng);
	    
	    // Update control position to be anchored next to mouse position.
	    this.node_.style.left = point.x + this.ANCHOR_OFFSET_.x + 'px';this.node_.style.top = point.y + this.ANCHOR_OFFSET_.y + 'px';
	};	
	return new GoogleTooltip();	
};