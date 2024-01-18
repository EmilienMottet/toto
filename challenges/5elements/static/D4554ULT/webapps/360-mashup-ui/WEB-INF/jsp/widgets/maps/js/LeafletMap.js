
function LeafletMap(ucssid, options) {
	this.ucssid = ucssid;
	
	this.provider = options.provider;
	var layers = this.provider.getLayers(); 	
	
	this.options = {
		zoom: options.defaultZoom,
		center: ['48.8', '2.5'],
		zoomControl: true,
		layers : [ layers["Road"] ]
	};
	
	this.ajax = options.ajax;
		
	this.map = L.map(ucssid, this.options);
	
	this.controlLayer = L.control.layers(layers, null).addTo(this.map);
		
	if (this.ajax) {
		this.enableAjaxClient();
	}
};

LeafletMap.prototype.getProvider = function () {
	return this.provider;
};

LeafletMap.prototype.getMap = function () {
	return this.map;
};

LeafletMap.prototype.getControlLayer = function () {
	return this.controlLayer;
};

LeafletMap.prototype.enableAjaxClient = function () {
	var map = this.map;
	var ajax = this.ajax;
	map.on('dragend', function () {
		var client = new MashupAjaxClient(map.getContainer());
		var wuid = ajax.wuid;
		var wuids = ajax.wuids;
		for (var i = 0; i < wuids.length; i ++) {
			client.addWidget(wuids[i], wuids[i] != wuid);
		}

		client.addParameter(wuid+'_ajax', 'true');
		client.addParameter(wuid+'_cssId', ajax.cssId);
		client.addParameter(ajax.latParameterName, map.getCenter().lat);
		client.addParameter(ajax.lngParameterName, map.getCenter().lng);
		client.addParameter(ajax.zoomlevelParameterName, map.getZoom());
		client.update();

		return true;
	});
};