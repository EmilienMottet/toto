/**
 * @author nlevert
 */

var MappyManager = {
	markers: [],
	map: null,
	mapId: null,
	toolbarOptions: {},
	
	setOnDragEndCallback: function(fn) {
		var that = this;
		// register event listener for dragend
		this.map.addListener("dragstop", function() {
			return fn(that.map);
		});
	},
	
	show: function(mapId) {
		this.mapId = mapId;

		if (this.markers.length == 0 || window.Mappy == undefined) {
			$('#' + this.mapId).closest('.searchWidget').hide();
			window.hasMappy = false;
			return;
		} else {
			window.hasMappy = true;
		}

		this.map = new Mappy.api.map.Map({
			container: '#' + this.mapId
		});

		if (this.markers.length > 0) {
			var rect = this.getRect();
			this.map.setCenter(this.findCenter(rect), this.getZoomLevel(rect));

			// Create MarkerLayer
			var markerLayer = new Mappy.api.map.layer.MarkerLayer(40);
			this.map.addLayer(markerLayer);

			// Append markers to the map and add click event
			for (var indexMarker = 0; indexMarker < this.markers.length; indexMarker++) {
				// Create Marker icon
				var icon = this.getIcon(indexMarker);

				// Create Marker
				this.markers[indexMarker].marker = new Mappy.api.map.Marker(new Mappy.api.geo.Coordinates(this.markers[indexMarker].lon, this.markers[indexMarker].lat), icon);
				this.markers[indexMarker].marker.setPopUpOptions(new Mappy.api.map.PopUpOptions({
					mappyDecoration: (this.markers[indexMarker].mappyDecoration == 'true')
				}));

				if (this.markers[indexMarker].url || (this.markers[indexMarker].$appendMarker && this.markers[indexMarker].$appendMarker.length > 0)) {
					// Bind click
					this.markers[indexMarker].marker.addListener('click', function (e) {
						var marker = $(e.currentTarget).data('marker');
						if (marker.url) {
							exa.redirect(marker.url);
						} else {
							var $bodyElem = ($.browser.safari ? $('body') : $('html,body'));
							$bodyElem.animate({scrollTop: marker.$appendMarker.offset().top - 20});
						}
						return false;
					});
				}

				// Content Marker Info Window
				if (this.markers[indexMarker].messagePopup) {
					// Bind mouseover
					this.markers[indexMarker].marker.addListener('mouseover', function (e) {
						var marker = $(e.currentTarget).data('marker');
						marker.marker.openPopUp(marker.messagePopup)
					});
					this.markers[indexMarker].marker.addListener('mouseout', function (e) {
						var marker = $(e.currentTarget).data('marker');
						marker.marker.closePopUp();
					});
				}
				markerLayer.addMarker(this.markers[indexMarker].marker);
				$(this.markers[indexMarker].marker.div).data('marker', this.markers[indexMarker]);

				// Append Marker Image to the hid
				var imgHTML = '<img class="mappyMarker" src="' + icon.image + '" />';
				$(this.markers[indexMarker].$appendMarker).each(function() {
					var $imgMarker = $(imgHTML);
					$imgMarker.prependTo(this);
					$imgMarker.bind('click', {indexMarker:indexMarker}, function(e) {
						var $bodyElem = ($.browser.safari ? $('body') : $('html,body'));
						$bodyElem.animate({scrollTop: $('#' + MappyManager.mapId).offset().top - 20});
						return false;
					});
				});
			}
		}
	},

	showMiniMap: function(position) {
		if (window.hasMappy && position != 'false') {
			var minimapPosition = new Mappy.api.map.tools.ToolPosition(position);
			showMiniMap = new Mappy.api.map.tools.MiniMap(minimapPosition);
			this.map.addTool(showMiniMap);
		}
	},

	toolbar_showMiniMap: function(position) {
		if (this.toolbarOptions.miniMap == null && position != 'false') {
			this.toolbarOptions.miniMap = {
				label: "Open miniMap",
				position : position
			};
		}
	},

	toolbar_showMove: function(show) {
		if (this.toolbarOptions.move == null && show == true) {
			this.toolbarOptions.move = {
				label : "Click to move"
			};
		}
	},

	toolbar_showZoom: function(show) {
		if (this.toolbarOptions.zoom == null && show == true) {
			this.toolbarOptions.zoom = {
					label : "Zoom in/out"
			};
		}
	},

	toolbar_showMouseWheelZoom: function(show) {
		if (this.toolbarOptions.mouseWheelZoom == null && show == true) {
			this.toolbarOptions.mouseWheelZoom = {
					label : "Enable/Disable zoom on mousewheel"
			};
		}
	},

	toolbar_showSelection: function(show) {
		if (this.toolbarOptions.selection == null && show == true) {
			this.toolbarOptions.selection = {
					label : "Rectangle selection"
			};
		}
	},

	toolbar_showSlider: function(show) {
		if (this.toolbarOptions.slider == null && show == true) {
			this.toolbarOptions.slider = {
					label : "Slider"
			};
		}
	},

	showToolbar: function(position) {
		if (window.hasMappy && position != 'false') {
			var toolBarPosition = new Mappy.api.map.tools.ToolPosition(position, new Mappy.api.types.Point(10, 15));
			var toolBar = new Mappy.api.map.tools.ToolBar(this.toolbarOptions, toolBarPosition);
			this.map.addTool(toolBar);
		}
	},

	disableScrollWheelZoom: function(isDisable) {
		if (window.hasMappy && isDisable == true) {
			this.map.disableScrollWheelZoom();
		}
	},

	disableDraggable: function(isDisable) {
		if (window.hasMappy && isDisable == true) {
			this.map.disableDraggable();
		}
	},

	getIcon: function(indexMarker) {
		var icon = new Mappy.api.ui.Icon(Mappy.api.ui.Icon.DEFAULT);

		var bgColor = (this.markers[indexMarker].bgColor ? this.markers[indexMarker].bgColor : 'ff776b');
		var fgColor = (this.markers[indexMarker].fgColor ? this.markers[indexMarker].fgColor : '000000');
		
		icon.image = (this.markers[indexMarker].image ? this.markers[indexMarker].image : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%{indexMarker}|' + bgColor + '|' + fgColor);
		icon.image = icon.image.replace('%{indexMarker}', indexMarker + 1);
		
		icon.label = (this.markers[indexMarker].image ? this.markers[indexMarker].label : ''); // hide label
		
		icon.iconAnchor.x = this.markers[indexMarker].iconAnchorX;
		icon.iconAnchor.y = this.markers[indexMarker].iconAnchorY;
		
		icon.popUpAnchor.y = this.markers[indexMarker].popUpAnchorX;
		icon.popUpAnchor.y = this.markers[indexMarker].popUpAnchorY;
		
		icon.size.height = this.markers[indexMarker].sizeHeight;
		icon.size.width = this.markers[indexMarker].sizeWidth;

		return icon;
	},

	getRect: function() {
		var rect = {
				minX: null,
				maxX: null,
				minY: null,
				maxY: null
		}

		for (var i = 0; i < this.markers.length; i++) {
			if (i == 0) {
				rect.minX = this.markers[i].lat;
				rect.maxX = this.markers[i].lat;
				rect.minY = this.markers[i].lon;
				rect.maxY = this.markers[i].lon;
			} else {
				if (rect.minX > this.markers[i].lat) {
					rect.minX = this.markers[i].lat;
				}
				if (rect.maxX < this.markers[i].lat) {
					rect.maxX = this.markers[i].lat;
				}
				if (rect.minY > this.markers[i].lon) {
					rect.minY = this.markers[i].lon;
				}
				if (rect.maxY < this.markers[i].lon) {
					rect.maxY = this.markers[i].lon;
				}
			}
		}
		return rect;
	},

	getZoomLevel: function(rect) {
		var ne = new Mappy.api.geo.Coordinates(rect.maxX, rect.maxY);
		var sw = new Mappy.api.geo.Coordinates(rect.minX, rect.minY);

		return this.map.getBoundsZoomLevel(new Mappy.api.geo.GeoBounds(ne, sw));
	},

	findCenter: function(rect) {
		return new Mappy.api.geo.Coordinates(rect.minY + (rect.maxY - rect.minY) / 2, rect.minX + (rect.maxX - rect.minX) / 2);
	}
}