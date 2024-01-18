
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
		latlngArr.push(new google.maps.LatLng(split[0], split[1]));
	}
	var gmapPolygon = new google.maps.Polygon(this.geoFormManager.polygonOptions);
	gmapPolygon.setPath(latlngArr);
	gmapPolygon.setMap(this.geoFormManager.map);
	this.geoFormManager.addPolygon(gmapPolygon, true);
};


GeoInterfaceImpl.prototype.addCircle = function (circle) {	
	var split = circle.center.split(',');
	var gmapCircle = new google.maps.Circle(this.geoFormManager.circleOptions);
	gmapCircle.setCenter(new google.maps.LatLng(split[0], split[1]));
	gmapCircle.setRadius(parseInt(circle.radius));
	gmapCircle.setMap(this.geoFormManager.map);
	this.geoFormManager.addCircle(gmapCircle, true);
};

GeoInterfaceImpl.prototype.addMarker = function (marker) {
	this.markerManager.addMarkerExternal(marker);	
};

GeoInterfaceImpl.prototype.getPolygons = function () {	
	var ret = [],
		polygons = this.geoFormManager.polygons_,
		polygon;
	
	for (var i = 0; i < polygons.length; i ++) {
		polygon = new exa.geo.Polygon([]);
		polygons[i].getPaths().forEach(function (path) {
			path.forEach(function (latlng) {
				polygon.path.push(latlng.lat()+','+latlng.lng());
			});
		});
		ret.push(polygon);
	}
	return ret;
};

GeoInterfaceImpl.prototype.getCircles = function () {
	var ret = [],
		circles  = this.geoFormManager.circles_,
		circle;
	
	for (var i = 0; i < circles.length; i ++) {
		circle = new exa.geo.Circle(circles[i].center.lat()+','+circles[i].center.lng(), circles[i].radius);			
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