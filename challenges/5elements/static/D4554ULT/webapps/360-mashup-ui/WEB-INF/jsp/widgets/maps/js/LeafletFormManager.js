

var LeafletFormManager = function (leafMap) {
	var map = leafMap.map;
	this.map = map;
	var formLayer = new L.FeatureGroup();
	this.formLayer = formLayer;	
	map.addLayer(formLayer);
	leafMap.getControlLayer().addOverlay(formLayer, 'Form');
	
	this.polygons_ = [];
	this.circles_ = [];
	this.geoFacets_ = [];
	this.ctx_ = new exa.util.Context(this);
	
	this.polygonOptions = {
		stroke:false,
		fillColor: '#001871',
		fillOpacity:0.4,
		color: '#001871',
		weight: 1,
		zIndex: 1
	};
	this.circleOptions = {
		stroke:false,
		fillColor: '#001871',
		fillOpacity:0.4,
		color: '#001871',
		weight: 1,
		zIndex: 1
	};
	this.facetOptions = {
		stroke:false,
		fillColor: '#001871',
		fillOpacity:0.8,
		weight: 2,
		color: '#666',
		zIndex: 1
	};
	
	
};

LeafletFormManager.prototype.setEditable = function (enabled) {
	var map,
		drawControl,
		self;
	if (enabled) {
		map = this.map;
		self = this;
		drawControl = new L.Control.Draw({
			position: 'topleft',		
			draw: {			
				polygon: {
					shapeOptions: this.polygonOptions,
					title: 'Draw a polygon'
				},
				circle: {
					shapeOptions: this.circleOptions,
					title: 'Draw a circle'
				},
				rectangle: false,
				marker:false,
				polyline:false
			},
			edit:{
				featureGroup:this.formLayer
			}
		});
				
		map.addControl(drawControl);
		
		map.on('draw:created', function (e) {
			var type = e.layerType,
	        	layer = e.layer;
			if (type === 'polygon') {
				self.addPolygon(layer);
			}
			if (type === 'circle') {
				self.addCircle(layer);
			}
		});
		
		map.on('draw:edited', function (e) {
			self.dispatch();
		});
		
		map.on('draw:deleted', function (e) {
			e.layers.eachLayer(function (layer) {
				self.deletedLayer(layer);				
			});
		});
	}
};

LeafletFormManager.prototype.addPolygon = function(polygon, fromInterface) {
	this.polygons_.push(polygon);
	this.formLayer.addLayer(polygon);
	
	if (fromInterface) {
		this.fitForms();
	} else {
		this.dispatch();
	}
};

LeafletFormManager.prototype.deletedLayer = function(layer, fromInterface) {	
	for (var i = 0; i < this.polygons_.length; i ++){
		if (this.polygons_[i] == layer) {
			this.polygons_.splice(i, 1);
		}
	}	
	for (var i = 0; i < this.circles_.length; i ++){
		if (this.circles_[i] == layer) {
			this.circles_.splice(i, 1);
		}
	}
	if (fromInterface) {
		this.fitForms();
	} else {
		this.dispatch();
	}
};

LeafletFormManager.prototype.addCircle = function(circle, fromInterface) {
	this.circles_.push(circle);
	this.formLayer.addLayer(circle);
	
	if (fromInterface) {
		this.fitForms();
	} else {
		this.dispatch();
	}
};

LeafletFormManager.prototype.deletedCircle = function(circle, fromInterface) {	
	for (var i = 0; i < this.circles_.lenght; i ++){
		if (this.circles_[i] == circle) {
			this.circles_.splice(i, 1);
		}
	}
	
	if (fromInterface) {
		this.fitForms();
	} else {
		this.dispatch();
	}
};

LeafletFormManager.prototype.setGeoInterface = function(geoInterface) {
	this.geoInterface_ = geoInterface;
};

LeafletFormManager.prototype.dispatch = function() {
	if (this.geoInterface_) {
		this.geoInterface_.triggerChanged();
	}
};

LeafletFormManager.prototype.fitForms = function () {
	if (this.polygons_.length > 0 ||
			 this.circles_.length > 0 ||
			 this.geoFacets_.length > 0) {
		var bounds = new L.LatLngBounds(),
			i;
		
		for (i = 0; i < this.polygons_.length; i ++) {
			bounds.extend(this.polygons_[i].getBounds());
		}
		
		for (i = 0; i < this.circles_.length; i ++) {
			bounds.extend(this.circles_[i].getBounds());
		}
		
		for (i = 0; i < this.geoFacets_.length; i ++) {
			bounds.extend(this.geoFacets_[i].getBounds());
		}
		this.map.fitBounds(bounds);
	}
};

LeafletFormManager.prototype.addDiskFacet = function (lat, lng, radius, url, aggregation, legend) {
	var circle = new L.Circle([lat, lng], radius, this.facetOptions);
	this.addFacet_(circle, url, aggregation, legend);
};

LeafletFormManager.prototype.addPolygonFacet = function (path, url, aggregation, legend) {
	var latlngArr = [],
		split;
	for (var i = 0; i < path.length; i++) {
		split = path[i].split(',');
		latlngArr.push(new L.LatLng(split[0], split[1]));
	}
	var polygon = new L.Polygon(latlngArr, this.facetOptions);
	this.addFacet_(polygon, url, aggregation, legend);
};

LeafletFormManager.prototype.addBoundsFacet = function (min, max, url, aggregation, legend) {
	var bounds  = new L.LatLngBounds();
	var split = min.split(',');
	bounds.extend(new L.LatLng(split[0], split[1]));
	split = max.split(',');
	bounds.extend(new L.LatLng(split[0], split[1]));	
	var rectangle = new L.Rectangle(bounds, this.facetOptions);
	this.addFacet_(rectangle, url, aggregation, legend);
};

LeafletFormManager.prototype.addFacet_ = function (form, url, aggregation, legend) {
	this.formLayer.addLayer(form);
	form.aggregation_ = aggregation;
	form.on('click', function () {
		exa.redirect(url);
	});
	form.on('mouseover', function () {
		form.setStyle({
			stroke: true
		});
	});
	form.on('mouseout', function () {
		form.setStyle({
			stroke: false
		});
	});
	
	this.geoFacets_.push(form);
};

LeafletFormManager.prototype.clearFacets = function () {
	for (var form; this.geoFacets_.length && (form = this.geoFacets_.pop()); ) {
		this.formLayer.removeLayer(form);
	}
};

LeafletFormManager.prototype.clearForms = function () {
	var form;
	for (; this.polygons_.length && (form = this.polygons_.pop()); ) {
		this.formLayer.removeLayer(form);
	}
	for (; this.circles_.length && (form = this.circles_.pop()); ) {
		this.formLayer.removeLayer(form);
	}
	this.dispatch();
};

LeafletFormManager.prototype.computeFacetColors = function () {
	var geoFacets = this.geoFacets_,
		min,
		max,
		aggregation,
		i,
		diff,
		color,
		ptc;
	
	if (geoFacets.length > 0) {
		min = Number.MAX_VALUE;
		max = Number.MIN_VALUE;
		for (i = 0; i < geoFacets.length; i ++) {
			aggregation = geoFacets[i].aggregation_;
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
				ptc = (geoFacets[i].aggregation_-min)/diff;
				if (ptc == 1) {
					color = LeafletFormManager.COLORS[LeafletFormManager.COLORS.length-1];
				} else {
					color = LeafletFormManager.COLORS[Math.floor(ptc * LeafletFormManager.COLORS.length)];
				}
				geoFacets[i].setStyle({
					fillColor:color
				});
			}
			this.createLegend_(min, max);
			this.map.addControl(this.legendControl_);
		}		
	}
};

LeafletFormManager.prototype.createLegend_ = function (min, max) {
	var legend,
		$legend,
		i;
	if (this.legendControl_) {
		this.map.removeControl(this.legendControl_);
	}
	legend = document.createElement('div');
	$legend = $(legend);	
	$legend.empty();
	$legend.css({
		padding:'3px',
		backgroundColor:'#fff',
		opacity:0.8
	});
	$legend.append('<div style="float:left;margin-right:3px;">'+min+'</div>');
	for (i = 0; i < LeafletFormManager.COLORS.length; i ++) {
		$legend.append('<div class="gmaps-legend-color" style="background-color:'+LeafletFormManager.COLORS[i]+';width:20px;height:20px;float:left;"></div>');		
	}
	$legend.append('<div style="float:left;margin-left:3px;">'+max+'</div>');
	
	var ctrl = L.Control.extend({
	    options: {
	        position: 'bottomright'
	    },
	    onAdd: function (map) {
	    	return legend;
	    }
	});
	this.legendControl_ = new ctrl();
};

LeafletFormManager.COLORS = ['#f7dd80', '#f5c050', '#f1a239','#d36c2a','#9c1e21','#5d0501'];
