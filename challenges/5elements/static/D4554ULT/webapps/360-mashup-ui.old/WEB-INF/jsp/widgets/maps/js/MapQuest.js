
var MapQuestProvider = function (apiKey) {
	this.apiKey = apiKey;
};

MapQuestProvider.prototype.geocode = function (query, success) {	
	$.ajax({
		dataType: "jsonp",
		url : 'https://open.mapquestapi.com/geocoding/v1/address?key='+this.apiKey+'&location='+query,
		jsonp : 'callback',
		success: function (response) {
			if (response.results.length > 0 && response.results[0].locations.length > 0) {
				success([response.results[0].locations[0].latLng.lat, response.results[0].locations[0].latLng.lng]);
			}
		}
	});
};
	
MapQuestProvider.prototype.getLayers = function () {
	return {
		'Road' :MQ.mapLayer(),
		'Hybrid': MQ.hybridLayer(),
		'Satellite': MQ.satelliteLayer(),
		'Dark': MQ.darkLayer(),
		'Light': MQ.lightLayer()
	};
};