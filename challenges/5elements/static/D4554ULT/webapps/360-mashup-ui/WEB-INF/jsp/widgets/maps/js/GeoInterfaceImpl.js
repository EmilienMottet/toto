
GeoInterfaceImpl = function (geoFormManager, markerManager) {
	this.listeners_ = [];
	this.geoFormManager = geoFormManager;
	this.markerManager = markerManager;	
	geoFormManager.setGeoInterface(this);
};

GeoInterfaceImpl.prototype.addPolygon = function (polygon) {	
	var path = polygon.path,
		latlngArr = [];
	for (var i = 0; i < path.length; i++) {
		split = path[i].split(',');
		latlngArr.push(new L.LatLng(split[0], split[1]));
	}
	var form = new L.Polygon(latlngArr, this.geoFormManager.polygonOptions);
	this.geoFormManager.addPolygon(form, true);
};


GeoInterfaceImpl.prototype.addCircle = function (circle) {	
	var split = circle.center.split(',');
	var form = new L.Circle(split, parseInt(circle.radius, 10), this.geoFormManager.circleOptions);
	this.geoFormManager.addCircle(form, true);
};

GeoInterfaceImpl.prototype.addMarker = function (marker) {
	this.markerManager.addMarkerExternal(marker);	
};

GeoInterfaceImpl.prototype.getPolygons = function () {	
	var ret = [],
		polygons = this.geoFormManager.polygons_,
		polygon,
		path;
	
	for (var i = 0; i < polygons.length; i ++) {
		polygon = new exa.geo.Polygon([]);
		path = polygons[i].getLatLngs();
		for (var j = 0; j < path.length; j++) {
			polygon.path.push(path[j].lat+','+path[j].lng);
		}
		ret.push(polygon);
	}
	return ret;
};

GeoInterfaceImpl.prototype.getCircles = function () {
	var ret = [],
		circles  = this.geoFormManager.circles_,
		circle;
	
	for (var i = 0; i < circles.length; i ++) {
		circle = new exa.geo.Circle(circles[i].getLatLng().lat+','+circles[i].getLatLng().lng, circles[i].getRadius());			
		ret.push(circle);
	}
	return ret;
};

GeoInterfaceImpl.prototype.addOnChangedListener = function (listener) {
	this.listeners_.push(listener);
};

GeoInterfaceImpl.prototype.triggerChanged = function () {	
	for (var i = 0; i < this.listeners_.length; i ++) {
		this.listeners_[i].call();
	}
};

GeoInterfaceImpl.prototype.getInterface = function () {
	return exa.getInterface(exa.io.GeoInterface, this);
};