exa.provide('exa.geo');
exa.provide('exa.geo.Polygon');
exa.provide('exa.geo.Circle');

exa.geo.generateGeoDataElql = function (metaName, polygons, circles) {
	
	var formList = [],
		path,
		i,
		l;

	if (polygons) {
		for (i = 0, l = polygons.length; i < l; i ++) {
			path = exa.geo.generatePolygonElql(metaName, polygons[i]);
			if (path.length > 0) {
				formList.push(path);
			}
		}
	}
	if (circles) {
		for (i = 0, l = circles.length; i < l; i ++) {
			formList.push(exa.geo.generateCircleElql(metaName, circles[i]));
		}
	}
	
	if (formList.length > 1) {
		return '#or(' + formList.join(' ') + ')';
	}
	
	if (formList.length > 0) {
		return formList[0];
	}
	return '';
};

exa.geo.generatePolygonElql = function (metaName, polygon) {
	var path = polygon.path;
	if (path.length > 2) {		
		return '#within('+metaName+',('+path.join(';')+'))';
	}
	
	return '';
};

exa.geo.generateCircleElql = function (metaName, circle) {	
	return '#distance('+metaName+','+circle.center+','+circle.radius+')';
};
	
exa.geo.extractFromElql = function (input) {
	var geoData = {
		polygons : [],
		circles : []
	};
	
	var regexp = /#(distance|within)\([a-z_]+\,\(*([^\)]+)\)/g;
	
	var matches = regexp.exec(input);
	
	while(matches && matches.length > 0) {
				
		switch (matches[1]) {
		case 'distance':
			var splited = matches[2].split(',');		
			var circle = new exa.geo.Circle(splited[0]+','+splited[1], splited[2]);
			geoData.circles.push(circle);
			break;
		case 'within':
			var polygon = new exa.geo.Polygon(matches[2].split(';'));		
			geoData.polygons.push(polygon);
			break;
		}
		matches = regexp.exec(input);
	}
	
	
	return geoData;
};

exa.geo.Polygon = function (arrLatLng) {
	this.path = arrLatLng;
};

exa.geo.Circle = function (center, radius) {
	this.center = center;
	this.radius = radius;
};
