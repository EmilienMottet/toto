function GoogleMarker(options, icon) {
	this.id = options.id;
	this.address = options.address;
	this.messagePopup = options.messagePopup;
	this.hitUrl = options.hitUrl;
	this.icon = icon;
	
	if (options.location) {
		var latlng = options.location.split(',');
		this.setPosition(new google.maps.LatLng(latlng[0], latlng[1]));
	}
}
exa.inherit(GoogleMarker, exa.util.KVOObject);
exa.util.KVOObject.addProperty(GoogleMarker, 'position');

GoogleMarker.getGeocoder = function () {
	if (!GoogleMarker.geocoder_) {
		GoogleMarker.geocoder_ = new google.maps.Geocoder();  
	}
	return GoogleMarker.geocoder_;
};

GoogleMarker.geocodingTimer_ = null;
GoogleMarker.getGeocodingQueue = function () {
	if (!GoogleMarker.geocodingQueue_) {
		GoogleMarker.geocodingQueue_ = new exa.util.Queue();
	}
	return GoogleMarker.geocodingQueue_;
};

GoogleMarker.geocode = function (marker) {
	GoogleMarker.getGeocoder().geocode({'address': marker.address}, function(results, status) {
		switch (status) {
		case google.maps.GeocoderStatus.OK:
			marker.setPosition(results[0].geometry.location);
			marker.create();
			break;
		case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
			GoogleMarker.getGeocodingQueue().enqueue(marker);			
			break;
		}
		
		if (!GoogleMarker.geocodingTimer_ && GoogleMarker.getGeocodingQueue().getCount() > 0) {
			GoogleMarker.geocodingTimer_ = setTimeout(function() {
				GoogleMarker.geocodingTimer_ = null;
				if (GoogleMarker.getGeocodingQueue().getCount() > 0) {				
					GoogleMarker.geocode(GoogleMarker.getGeocodingQueue().dequeue());
				}
			},1000);
		}
	});
};

GoogleMarker.prototype.setMap = function (map) {
	this.map = map;
	if (this.gMarker) {
		this.gMarker.setMap(map);
	}
};

GoogleMarker.prototype.setSelected = function (selected) {
	if (this.gMarker) {
		if (selected) {
			this.gMarker.setAnimation(google.maps.Animation.BOUNCE);
			this.gMarker.getMap().panTo(this.gMarker.getPosition());
		} else {
			this.gMarker.setAnimation(null);
		}
	}
};

GoogleMarker.prototype.create = function() {
	if (this.position) {
		var gMarker = new google.maps.Marker({
			position: this.position,
			icon:this.icon,
			map: this.map
		});
		gMarker.setAnimation(google.maps.Animation.DROP);
		if (this.messagePopup) {
			var infoWindow = new google.maps.InfoWindow({
				content: this.messagePopup,
				maxWidth: 150
			});
	
			google.maps.event.addListener(gMarker, "mouseover", function() {
				infoWindow.open(this.getMap(), this);
			});
	
			google.maps.event.addListener(gMarker, "mouseout", function() {
				infoWindow.close();
			});
		}
		
		if (this.hitUrl) {
			var hitUrl = this.hitUrl;
			google.maps.event.addListener(gMarker, "click", function() {
				exa.redirect(hitUrl);
			});
		}
		
		this.gMarker = gMarker;
		
	} else if (this.address) {
		GoogleMarker.geocode(this);
	}
};