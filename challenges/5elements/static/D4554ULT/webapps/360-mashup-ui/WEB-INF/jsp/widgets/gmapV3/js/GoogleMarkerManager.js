
function GoogleMarkerManager(wuid, gMapWidget, iconFactory) {
	this.iconFactory = iconFactory || new GoogleIconFactory();
	this.markers = [];
	this.defaultZoom = gMapWidget.options.zoom;
	gMapWidget.addObserverForKey(this, 'map');
	
	exa.io.share('exa.io.HitDecorationInterface', wuid, exa.getInterface(exa.io.HitDecorationInterface, this));
	exa.io.share('exa.io.HitSelectionInterface', wuid, exa.getInterface(exa.io.HitSelectionInterface, this));
}

GoogleMarkerManager.prototype.observeValueForKey = function (key, obj) {
	switch (key) {
	case 'position':
		this.fitMarkers();
		break;
	case 'map':
		this.map = obj.getMap();
		for (var i = 0; i < this.markers.length; i ++)  {
			this.markers[i].setMap(this.map);
		}
		this.fitMarkers();
		break;
	}
};

GoogleMarkerManager.prototype.addMarker = function (markerOptions) {
	if (!markerOptions) {
		return this;
	}
	var marker = new GoogleMarker(markerOptions, this.iconFactory.create(markerOptions.iconUrl));
	this.addGoogleMarker_(marker);
};

GoogleMarkerManager.prototype.addMarkerExternal = function (markerOptions) {
	if (!markerOptions) {
		return this;
	}
	var size = null,
		origin = null,
		anchor = null;
	if (markerOptions.width && markerOptions.heigh) {
		size = new google.maps.Size(markerOptions.sizeWidth, markerOptions.sizeHeight);
	}
	if (markerOptions.originX || markerOptions.originY) {
		origin = new google.maps.Point(markerOptions.originX, markerOptions.originY);
	}
	if (markerOptions.anchorX || markerOptions.anchorY) {
		anchor = new google.maps.Point(markerOptions.anchorX, markerOptions.anchorY);
	}
	var marker = new GoogleMarker(markerOptions, new google.maps.MarkerImage(markerOptions.iconUrl, size, origin, anchor));
	this.addGoogleMarker_(marker);
};

GoogleMarkerManager.prototype.addGoogleMarker_ = function (gMarker) {
	gMarker.addObserverForKey(this, 'position');
	gMarker.create();
	
	this.markers.push(gMarker);
	
	if (this.map) {
		gMarker.setMap(this.map);
	}
};

GoogleMarkerManager.prototype.fitMarkers = function () {
	var position,
		bounds;
	if (this.map) {		
		if (this.markers.length > 1) {
			bounds = new google.maps.LatLngBounds();
			
			for (var i = 0; i < this.markers.length; i ++)  {
				position = this.markers[i].getPosition();
				if (position) {
					bounds.extend(position);
				}
			}
			if (this.markers.length > 1) {
				this.map.fitBounds(bounds);
			}
		} else if (this.markers.length == 1) {
			position = this.markers[0].getPosition();
			if (position) {
				this.map.setCenter(this.markers[0].getPosition());
				this.map.setZoom(this.defaultZoom);
			}
		}
	}
};

GoogleMarkerManager.prototype.clearMarkers = function () {
	for (var marker; this.markers.length && (marker = this.markers.pop()); ) {
		marker.setMap(null);
	}
	this.iconFactory.index = 1;
};

/** implements HitDecorationInterface */
GoogleMarkerManager.prototype.getDecoration = function (id) {
	for (var i = 0; i < this.markers.length; i ++)  {
		if (id == this.markers[i].id) {
			return '<img class="gmarker" src="' + this.markers[i].icon.url + '" />';
		}
	}
	return null;
};

/** implements HitSelectionInterface */
GoogleMarkerManager.prototype.select = function (id) {
	for (var i = 0; i < this.markers.length; i ++)  {
		this.markers[i].setSelected(id == this.markers[i].id);
	}
};



function GoogleIconFactory(option) {
	option = option || {};
	this.sizeWidth = option.sizeWidth || 21;
	this.sizeHeight = option.sizeHeight || 34;
	this.iconAnchorX = option.iconAnchorX || 10;
	this.iconAnchorY = option.iconAnchorY || 31;
	
	var bgColor = (option.bgColor) ? option.bgColor.replace('#', '') : '3279BE';
	var fgColor = (option.fgColor) ? option.fgColor.replace('#', '') : 'FFF';
	this.defaultIconUrl = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%{indexMarker}|' + bgColor + '|' + fgColor;
	this.index = 1;
}

GoogleIconFactory.replaceIndexMarkerRegExp = /%{indexMarker}/g;

GoogleIconFactory.prototype.create = function (iconUrl) {
	if (!iconUrl) {		
		iconUrl = this.defaultIconUrl;
	}
	GoogleIconFactory.replaceIndexMarkerRegExp.lastIndex = 0;
	if (GoogleIconFactory.replaceIndexMarkerRegExp.test(iconUrl)) {
		iconUrl = iconUrl.replace(GoogleIconFactory.replaceIndexMarkerRegExp, this.index);
		this.index ++;
	}
	
	return new google.maps.MarkerImage(iconUrl,
			// This marker tall.
			new google.maps.Size(this.sizeWidth, this.sizeHeight),
			// The origin for this image.
			new google.maps.Point(0, 0),
			// The anchor for this image.
			new google.maps.Point(this.iconAnchorX, this.iconAnchorY)
		);
};