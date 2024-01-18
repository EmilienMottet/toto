/* Marker */
function LeafletMarker(options, icon, index) {
	this.id = options.id;
	this.address = options.address;
	this.messagePopup = options.messagePopup;
	this.hitUrl = options.hitUrl;
	this.icon = icon;
	this.index = index;
	
	if (options.location) {
		this.position = options.location.split(',');
	}
}

LeafletMarker.prototype.geocode = function () {
	var marker = this;
	this.markerManager.provider.geocode(this.address, function (position) {
		marker.position = position;
		marker.create();
		marker.markerManager.fitMarkers();
	});	
};

LeafletMarker.prototype.addTo = function (markerManager) {
	this.markerManager = markerManager;
	if (this.leafletMarker) {
		markerManager.getLayer().addLayer(this.leafletMarker);
	}
};

LeafletMarker.prototype.setSelected = function (selected) {
	if (this.leafletMarker) {
		if (selected) {
			this.markerManager.getMap().panTo(this.leafletMarker.getLatLng());
		}
	}
};

LeafletMarker.prototype.create = function() {
	if (this.position) {
		var leafletMarker = L.marker(this.position, {
			icon: this.icon
		});
		if (this.markerManager) {
			this.markerManager.getLayer().addLayer(leafletMarker);
		}
		if (this.messagePopup) {
			leafletMarker.bindPopup(this.messagePopup, {
				maxWidth: 150,
				autoPan: true,
				closeButton:false
			});
			leafletMarker.on("mouseover", function() {
				leafletMarker.openPopup();
			});				
			leafletMarker.on("mouseout", function() {
				leafletMarker.closePopup();
			});
		}
		
		if (this.hitUrl) {
			var hitUrl = this.hitUrl;
			leafletMarker.on("click", function() {
				exa.redirect(hitUrl);
			});
		}
		
		this.leafletMarker = leafletMarker;
		
	} else if (this.address) {
		this.geocode();
	}
};

/* MarkerManager */

function LeafletMarkerManager(wuid, leafMapWidget, iconFactory) {
	this.iconFactory = iconFactory || new LeafletIconFactory();
	this.markers = [];
	this.defaultZoom = leafMapWidget.options.zoom;	
	this.map = leafMapWidget.map;
	this.provider = leafMapWidget.getProvider();
	this.apiKey = leafMapWidget.apiKey;
	this.markerLayer = L.layerGroup();
	this.markerLayer.addTo(this.map);
	
	leafMapWidget.getControlLayer().addOverlay(this.markerLayer, 'Markers');	
	
	exa.io.share('exa.io.HitDecorationInterface', wuid, exa.getInterface(exa.io.HitDecorationInterface, this));
	exa.io.share('exa.io.HitSelectionInterface', wuid, exa.getInterface(exa.io.HitSelectionInterface, this));
};

LeafletMarkerManager.prototype.getMap = function () {
	return this.map;
};

LeafletMarkerManager.prototype.getLayer = function () {
	return this.markerLayer;
};

LeafletMarkerManager.prototype.addMarker = function (markerOptions) {
	if (!markerOptions) {
		return this;
	}
	var index = this.iconFactory.index;
	var marker = new LeafletMarker(markerOptions, this.iconFactory.create(markerOptions.iconUrl), index);
	this.addMarker_(marker);
};

LeafletMarkerManager.prototype.addMarkerExternal = function (markerOptions) {
	if (!markerOptions) {
		return this;
	}
	var iconOption = {};
	if (markerOptions.width && markerOptions.heigh) {
		iconOption.iconSize = [ markerOptions.width, markerOptions.height ];
	}
	if (markerOptions.anchorX || markerOptions.anchorY) {
		iconOption.iconAnchor = [ markerOptions.anchorX, markerOptions.anchorY ];
	}
	iconOption.iconUrl = markerOptions.iconUrl;
	var marker = new LeafletMarker(markerOptions, L.icon(iconOption));
	this.addMarker_(marker);
};

LeafletMarkerManager.prototype.addMarker_ = function (leafletMarker) {	
	leafletMarker.addTo(this);
	leafletMarker.create();
	this.markers.push(leafletMarker);
};

LeafletMarkerManager.prototype.fitMarkers = function () {
	var position,
		bounds,
		callFitBounds;
	if (this.map) {		
		if (this.markers.length > 1) {
			callFitBounds = 0;
			bounds = new L.LatLngBounds();			
			for (var i = 0; i < this.markers.length; i ++)  {
				position = this.markers[i].position;
				if (position) {
					callFitBounds++;
					bounds.extend(new L.LatLng(position[0], position[1]));
				}
			}
			if (callFitBounds>1) {
				this.map.fitBounds(bounds);
			}
		} else if (this.markers.length == 1) {
			position = this.markers[0].position;
			if (position) {
				this.map.setView(position, this.defaultZoom);
			}
		}
	}
};

LeafletMarkerManager.prototype.clearMarkers = function () {
	this.markerLayer.clearLayers();
	this.markers.length = 0;
	this.iconFactory.index = 1;
};

/** implements HitDecorationInterface */
LeafletMarkerManager.prototype.getDecoration = function (id) {
	var clone,
		marker;
	for (var i = 0; i < this.markers.length; i ++)  {
		marker = this.markers[i];
		if (id == marker.id) {
			clone = marker.icon.createIcon();
			clone.style.cssText = '';
			clone.className = marker.icon.options.className; 
			return clone;
		}
	}
	return null;
};

/** implements HitSelectionInterface */
LeafletMarkerManager.prototype.select = function (id) {
	for (var i = 0; i < this.markers.length; i ++)  {
		this.markers[i].setSelected(id == this.markers[i].id);
	}
};

function LeafletIconFactory(option) {
	option = option || {};
	this.className = option.className || 'maps-icon';
	this.sizeWidth = option.sizeWidth || 24;
	this.sizeHeight = option.sizeHeight || 42;
	this.iconAnchorX = option.iconAnchorX || 12;
	this.iconAnchorY = option.iconAnchorY || 42;
	this.index = 1;
}

LeafletIconFactory.replaceIndexMarkerRegExp = /%{indexMarker}/g;

LeafletIconFactory.prototype.create = function (iconUrl) {
	var i = this.index;
	if (iconUrl) {
		LeafletIconFactory.replaceIndexMarkerRegExp.lastIndex = 0;
		if (LeafletIconFactory.replaceIndexMarkerRegExp.test(iconUrl)) {
			iconUrl = iconUrl.replace(LeafletIconFactory.replaceIndexMarkerRegExp, i);
			this.index++;
		}
		return new L.Icon({
			iconUrl: iconUrl,
			iconSize: [this.sizeWidth, this.sizeHeight],
		    iconAnchor: [this.iconAnchorX, this.iconAnchorY],
		    popupAnchor: [0, -this.iconAnchorY]
		});
	} else {
		this.index++;
		return new L.DivIcon({
			className:this.className,
		    iconSize: [this.sizeWidth, this.sizeHeight],
		    iconAnchor: [this.iconAnchorX, this.iconAnchorY],
		    popupAnchor: [0, -this.iconAnchorY],
			html:String(i)
		});
	}
};