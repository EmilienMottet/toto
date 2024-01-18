/**
 * Mashup Ajax Client
 * @param _this is the DOM element where the event occured
 * @param options {
 * 		spinner: true/false
 * }
 * @returns {MashupAjaxClient}
 */
function MashupAjaxClient(_this, options) {
	this.options = $.extend({
		spinner: true
	}, options);

	this.$container = $(_this);
	if (this.$container.hasClass('wuid') == false) {
		this.$container = this._getParentWidget(this.$container);
	}
	if (this.$container.length == 0) {
		this.$container = $('body');
	}

	this.ajaxRequest = null;
	this.paths = {};
	this.eraseWidgets = [];
	this.url = new BuildUrl(window.location.search); // ?q=exalead
}

MashupAjaxClient.prototype.addWidget = function(wuid, erase) {
	if (typeof(erase) == 'undefined') {
		erase = true;
	}

	var cssIds = this._findWidget(wuid, this.$container, erase);

	for (var i = 0; i < cssIds.length; i++) {
		var cssId = cssIds[i];
		if (this.paths[cssId] != undefined) {
			continue; // already registered
		}

		var path = this._findPath($('.' + cssId));
		if (path == null) {
			continue; // could not compute the widget path
		}
		this.paths[cssId] = path;

		if (erase == true) {
			this.eraseWidgets.push(cssId);
		}
	}

	return this;
};

/**
 * Existing key will be replaced
 * @param key
 * @param values
 * @returns {MashupAjaxClient}
 */
MashupAjaxClient.prototype.addParameters = function(key, values) {
	this.url.addParameters(key, values, true);
	return this;
};

/**
 * Existing key will be replaced
 * @param key
 * @param value
 * @returns {MashupAjaxClient}
 */
MashupAjaxClient.prototype.addParameter = function(key, value) {
	this.url.addParameter(key, value, true);
	return this;
};

MashupAjaxClient.prototype.setQueryString = function(queryString) {
	this.url.setQueryString(queryString, true); // setQueryString must override window.location.search, otherwise you can have unexpected duplicate parameters such as feedName.page when paginating
	return this;
};

MashupAjaxClient.prototype.getAjaxUrl = function() {
	this.url.setUrl(mashup.baseUrl + window.location.pathname.replace(/.*\/([^/]+)$/, "/ajax/$1") + "/" + this._getAllPath().join(','));
	return this.url;
};

MashupAjaxClient.prototype.update = function() {
	var _this = this;

	if ($.isEmptyObject(this.paths)) {
		throw 'No widget to update. The addWidget method must be call at least once.';
	}

	this.showSpinner();
	this.ajaxRequest = $.ajax({
		type: 'GET',
		url: this.getAjaxUrl().toString(),
		dataType: 'json',
		cache: false,
		success: function(data, textStatus) {
			if (data != null) { // request was aborted
				for (var i = 0; i < data.widgets.length; i++) {
					if (data.widgets[i].html && data.widgets[i].cssId) {
						if (_this.eraseWidgets.indexOf(data.widgets[i].cssId) == -1) {
							$('.' + data.widgets[i].cssId).append(data.widgets[i].html);
						} else {
							$('.' + data.widgets[i].cssId).replaceWith(data.widgets[i].html);
						}
					}
				}
	//			$('#mainWrapper').append(data.executeLater);
				$('#mainWrapper').append(data.appendScript);
				if (_this.options.success && typeof(_this.options.success) == "function") {
					_this.options.success.call(this, data, textStatus);
				}
			}
			_this.remove();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			if (_this.options.error && typeof(_this.options.error) == "function") {
				_this.options.error.call(this, textStatus, errorThrown);
			}
			_this.remove();
		}
	});
};

MashupAjaxClient.prototype.updateInterval = function(refreshInterval) {
	var _this = this;
	return setInterval(function(){
		_this.update();
	},refreshInterval);
};

MashupAjaxClient.prototype.remove = function() {
	this.ajaxRequest.abort();
	if (this.options.spinner) {
		this.hideSpinner();
	}
};

MashupAjaxClient.prototype.showSpinner = function() {
	for (var cssId in this.paths) {
		if (this.paths.hasOwnProperty(cssId)) {
			$('.' + cssId).showSpinner({ overlay: true });
		}
	}
};

MashupAjaxClient.prototype.hideSpinner = function() {
	for (var cssId in this.paths) {
		if (this.paths.hasOwnProperty(cssId)) {
			$('.' + cssId).hideSpinner();
		}
	}
};

/**
 * Returns a clean path that remove useless pathes
 * @returns
 */
MashupAjaxClient.prototype._getAllPath = function() {
	var paths = [];
	for (var cssId in this.paths) {
		if (this.paths.hasOwnProperty(cssId)) {
			paths.push(this.paths[cssId]);
		}
	}
	return paths;
};

/**
 * Returns the parent widget
 * @param $node
 * @returns
 */
MashupAjaxClient.prototype._getParentWidget = function($node) {
	if ($node.hasClass('wuid') == true) {
		return $node.parent().closest('.wuid');
	} else {
		return $node.closest('.wuid');
	}
};

/**
 * Returns the unique css id
 * @param cssClass
 * @returns
 */
MashupAjaxClient.prototype._getUCssId = function(cssClass) {
	var classes = cssClass.split(' ');
	for (var i = 0; i < classes.length; i++) {
		// dependency with UCssId.java
		var match = /[^_\ ]{8}_(?:[0-9]+_[^\ ]+)?/gi.exec(classes[i]);
		if (match != null) {
			return match[0];
		}
	}
	return null;
};

/**
 * Recursive function
 * @param wuid
 * @param $node
 * @returns
 */
MashupAjaxClient.prototype._findWidget = function(wuid, $node, erase) {
	var cssIds = [];

	var $widgets = $node.find('.wuid.' + wuid);
	if ($widgets.length > 0) {
		for (var i = 0; i < $widgets.length; i++) {
			cssIds.push(this._getUCssId($($widgets[i]).attr('class')));
		}
	} else {
		// Legacy: $node is supposed to be a container, don't know why we try to lookup
		// within the parents....
		var $parentNode = $node.parent();
		if ($parentNode.length > 0) {
			return this._findWidget(wuid, $parentNode, erase);
		}
	}

	return cssIds;
};

/**
 * Recursive function
 * @param $widget
 * @returns
 */
MashupAjaxClient.prototype._findPath = function($widget) {
	var $upperWidget = this._getParentWidget($widget);
	if ($upperWidget.length > 0) {
		var p = this._findPath($upperWidget);
		p += ':' + this._getUCssId($widget.attr('class'));
		return p;
	} else {
		return this._getUCssId($widget.attr('class'));
	}
};