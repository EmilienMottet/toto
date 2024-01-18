(function($, udef) {

	if (window && window.NavigationHistory !== udef) {
		throw new Error("Can't instantiate: window.NavigationHistory is already taken");
	}

	function getUri() {
		return location.pathname + location.search;
	}

	var NavigationHistory = window.NavigationHistory = function($widget, storageMethod, storageKey, options) {
		this.$widget = $widget;
		this.storageKey = storageKey;
		this.options = options;

		var _this = this;

		if (storageMethod == undefined || storageMethod == 'Cookie') {
			this.save = function(jsonObj) {
				$.cookie(_this.storageKey, $.toJSON(jsonObj));
			};
			this.load = function(callback) {
				var json = $.evalJSON($.cookie(_this.storageKey) || '[]');
				callback(json);
			};
		} else {
			this.db = new StorageClient('user');
			this.save = function(jsonString) {
				_this.db.set(_this.storageKey, $.toJSON(jsonString));
			};
			this.load = function(callback) {
				_this.db.get(_this.storageKey, function(items) {
					var qhist = [];
					try {
						if (items.length == 1) {
							qhist = $.evalJSON(items[0].value);
						}
					} catch(e) {
						_this.db.del(items[0].key);
					}
					callback(qhist);
				});
			};
		}
	};

	NavigationHistory.prototype.constructor = NavigationHistory;

	NavigationHistory.prototype.onReady = function(label) {
		var _this = this;
		this.load(function(json) {
			if (json.length == 0 || json[json.length - 1].url != getUri()) {
				json.push({ name: label, url: getUri() });
				json = json.reverse().slice(0, _this.options.maxSize).reverse();
			}
			if (json.length > 0) {
				var $ul = _this.$widget.find('ul');
				for (var i = 0; i < json.length; i++) {
					$li = $('<li><a href="' + json[i].url + '">' + json[i].name + '</a></li>');
					if (i == (json.length - 1)) {
						$li.addClass('current');
					} else if (_this.options.separator != '') {
						$li.append('<span class="separator">' + _this.options.separator + '</span>');
					}
					if (_this.options.reverse == 'true') {
						$ul.prepend($li);
					} else {
						$ul.append($li);
					}
				}
			}
			_this.save(json);
		});
	};

})(jQuery);
