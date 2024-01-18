
function GoogleMapWidget(ucssid, options) {
	this.ucssid = ucssid;
	this.options = {
		zoom: options.defaultZoom,
		center: new google.maps.LatLng('48.8', '2.5'),
		mapTypeId: google.maps.MapTypeId[options.mapTypeId || 'ROADMAP'],
		streetViewControl: options.streetViewControl,
		mapTypeControl: options.mapTypeControl,
		zoomControl: true
	};

	this.ajax = options.ajax;

	this.markers = [];
}
exa.inherit(GoogleMapWidget, exa.util.KVOObject);
exa.util.KVOObject.addProperty(GoogleMapWidget, 'map');

GoogleMapWidget.prototype.decorate = function () {
	this.setMap(new google.maps.Map(document.getElementById(this.ucssid), this.options));

	if (this.ajax) {
		this.enableAjaxClient();
	}
};

GoogleMapWidget.prototype.enableAjaxClient = function () {
	var map = this.map;
	var ajax = this.ajax;
	google.maps.event.addListener(map, 'dragend', function () {

		var client = new MashupAjaxClient(map.getDiv());
		var wuid = ajax.wuid;
		var wuids = ajax.wuids;
		for (var i = 0; i < wuids.length; i ++) {
			client.addWidget(wuids[i], wuids[i] != wuid);
		}

		client.addParameter(wuid+'_ajax', 'true');
		client.addParameter(wuid+'_cssId', ajax.cssId);
		client.addParameter(ajax.latParameterName, map.getCenter().lat());
		client.addParameter(ajax.lngParameterName, map.getCenter().lng());
		client.addParameter(ajax.zoomlevelParameterName, map.getZoom());
		client.update();

		return true;
	});
};