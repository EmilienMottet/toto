(function($, udef) {
	
  if (window && window.SavedQueries !== udef) {
    throw new Error("Can't instantiate: window.SavedQueries is already taken");
  }
  
  // private vars + methods
  
  function isValidOptions(opts) {
  	return typeof(opts) === "object"
  		&& opts.type !== udef
  		&& typeof(opts.key) === 'string'
  		&& opts.key.match(/\[\]$/);
  }
  
  /**
   * Returns true if q contains URI
   */
  function indexOfUri(q, uri) {
  	for (var i = 0; i < q.length; i++) {
  		var c = q[i];
  		if (c.value.uri === uri) {
  			return i;
  		}
  	}
  	return -1;
  }

	function getUri() {
		return location.pathname + location.search;
	}

  // constructor
  
  /**
   * Create a new SavedQueries instance,
   * 
   * options must contain:
   * 	 type: String (Personal|Shared) queries
   *   dbKey: String key to use for storage
   */
  var SavedQueries = window.SavedQueries = function(options) {
  	this.options = options;
  	this.queries = [];
  	
  	if (!isValidOptions(options)) {
  		throw new Error("SavedQueries: Could not instantiate- invalid options argument");
  	}
  	
  	if (this.options.type === 'Private') {
  		this.db = new StorageClient('user');
  	} else {
  		this.db = new StorageClient('shared');
  	}
  };
  
  
  // public interface
  
  SavedQueries.prototype.constructor = SavedQueries;

  SavedQueries.prototype.onReady = function(options) {
	var _this = this;
	var $widget = $("#" + options.widgetId);

	/* on show */
	var onShow = function(e, instant) {
		$widget.find('.widgetHeader').removeClass('rounded-bottom');
		$widget.find('.show').hide();
		$widget.find('.hide').show();
		if (instant == true) {
			$widget.find('.widgetContent').show();
		} else {
			$widget.find('.widgetContent').slideDown(100);
		}
		return false;
	};
	$widget.find('.show').bind('click', onShow);

	/* on hide */
	$widget.find('.hide').bind('click', function(e) {
		$widget.find(".widgetContent").slideUp(100);
		$widget.find(".widgetHeader").addClass("rounded-bottom");
		$widget.find('.show').show();
		$widget.find('.hide').hide();
		return false;
	});

	/* on save */
	$widget.find('.save').bind('click', function(e) {
		var overlay = $("#overlay-"+options.widgetId);
		if(overlay.length == 0) {
					
			var offset = $(this).offset();
			
			$prompt = $("<div>");
			$prompt.attr("id","overlay-"+options.widgetId);
			$prompt.addClass("overlay-form");
			$prompt.addClass("rounded");
			var html = '<div><span>' + mashupI18N.get('savedQueries', 'query-name') + ':</span> <input class="query-name" type="text" value="' + mashupI18N.get('savedQueries', 'sample-query-name') + '" /></div><div class="form-rigth"><input type="button" class="btn-cancel" value="' + mashupI18N.get('savedQueries', 'cancel') + '"><input type="button" class="btn-ok" value="' + mashupI18N.get('savedQueries', 'ok') + '"></div>';
			html += '<div class="arrow-top-right" style="right:24px;"></div>';
			$prompt.html(html);
			
			$prompt.find(".btn-cancel").click(function(){
				$prompt.hide();
			});
			$prompt.find(".btn-ok").click(function(){
				var name = $prompt.find(".query-name").val();
				_this.add(getUri(), name.escapeHTML(), refresh, function() {
					alert("Connectivity error / Query already exists / Not logged in");
				});
				$prompt.hide();
			});
			
			$prompt.css("top",offset.top + $(this).outerHeight(true) + 10 +"px");
			$prompt.css("left",offset.left + $(this).outerWidth(true) - 312 +"px"); // width + padding + border - extrapadding = 300 + 20 - 10
			$prompt.css("width","300px");
			
			$widget.append($prompt);
		}else {
			overlay.show();
		}	
		
		return false;
	});

	

	/* on refresh */
	function refresh() {
		_this.refresh(function(queries) {
			var html = '';
			var nbQueries = queries.length;
			if (nbQueries > 0) {
				for (var i = 0; i < nbQueries; i++) {
					var q = queries[i];
					html += '<li><a href="' + q.uri + '" class="key">' + q.name.replace(/<>&/g, "") + '</a>';
					if (options.showDelete != undefined && options.showDelete == true) {
						html += ' <a href="#" class="delete">&times;</a>';
					}
					html += '</li>';
				}
			} else {
				html = '<li>('+mashupI18N.get('savedQueries', 'nothing-to-display')+')</li>';
			}
			$widget.find('.widgetContent ul').html(html);

			/* on delete */
			$widget.find('.delete').on('click', function(e) {
				var uri = $(this).parents('li').find('a.key').attr('href');
				_this.del(uri, refresh);
				return false;
			});
			
			if (_this.contains(getUri())) {
				$widget.find('.save').hide();
			} else {
				$widget.find('.save').show();
			}
			
			
			
		}, function(httpStCode) {
			var error = httpStCode == 403 ? "You are not logged in" : "The queries could not be fetched at this time";
			$widget.find('.widgetContent').html(error);
			$widget.find('.widgetContent').addClass('error');
			$widget.find('.save').hide();
		});
	}

	/* init widget status */
	if (options.showExpanded != undefined && options.showExpanded == true) {
		onShow(undefined, true);
	}
	refresh();
  };

  /**
   * Add a new Query - Fails if query with same URI already exists
   */
  SavedQueries.prototype.add = function add(uri, name, successFn, failFn) {
  	if (typeof(uri) !== 'string' || typeof(name) !== 'string') {
  		throw new Error("Illegal arguments: uri or name not string");
  	}
  	var self = this;
  	this.refresh(function() {
  		// Fail if page is already saved 
  		if (indexOfUri(self.queries, uri) !== -1) {
  			failFn();
  			return;
  		}
  		
  		self.db.put(self.options.key, $.toJSON({uri: uri, name: name.substr(0, 100)}), function() {
  			self.refresh(successFn, failFn);
  		}, failFn);
  	}, failFn);
  	
  };
  
  /**
   * Delete an existing Query given its URI,
   * Calls failFn if query with 'uri' does not exist
   * 
   * @returns 
   */
  SavedQueries.prototype.del = function add(uri, successFn, failFn) {
  	var self = this;
  	this.refresh(function() {

  		var idx = indexOfUri(self.queries, uri);
  		
  		if (idx !== -1) {
  			self.db.del(self.queries[idx].key, function() {
  				self.refresh(successFn, failFn);
  			}, failFn);
  		} else {
  			(failFn || $.noop)();
  		}
  		
  	}, failFn);
  };
  
  /**
   * Fetches the internal queries variable
   * @param successFn
   * @param failFn
   */
  SavedQueries.prototype.getAll = function getAll(sfn, ffn) {
  	return this.queries.map(function(e) {
  		return e.value;
  	});
  };
  
  /**
   * Returns true if there's a query matching 'uri'
   * @param uri
   * @returns {Boolean}
   */
  SavedQueries.prototype.contains = function contains(uri) {
  	return indexOfUri(this.queries, uri) !== -1;
  };
  
  /**
   * Refreshes the internal state, fetching any queries from the server
   * @param s on success
   * @param f on failure
   */
  SavedQueries.prototype.refresh = function refresh(s, f) {
  	var self = this;
  	var s = s || $.noop;
  	var f = f || $.noop;
  	
  	this.db.get(this.options.key, function(items) {
  		
  		for (var i = 0; i < items.length; i++) {
  			try {
  				items[i].value = $.evalJSON(items[i].value);
  			} catch (e) {
  				// parsing error, skip and delete this entry
  				db.del(items[i].key);
  			}
  		}
  		
  		self.queries = items;
  		s($.map(self.queries, function(e) {
  			return e.value;
  		}));
  	}, f);
  };

  
})(jQuery);
