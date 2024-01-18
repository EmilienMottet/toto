/*
 * The BuildUrl class is also present in the MashupBuilder.
 */


/**
 *
 * @param url
 * @param override {boolean} True if parameters in the queryString are not multi evaluated
 * @returns {BuildUrl}
 */
function BuildUrl(url) {
	this.params = {};
	this.setUrl(url, false);
}

BuildUrl.SORT_PARAMETER = ".s";
BuildUrl.PAGE_PARAMETER = ".page";
BuildUrl.REFINE_CATEGORY_PARAMETER = ".r";
BuildUrl.CANCEL_CATEGORY_PARAMETER = ".cr";
BuildUrl.ZAP_CATEGORY_PARAMETER = ".zr";

/**
*
*/
BuildUrl.prototype.getPage = function() {
	return (this.path || '').substring((this.path || '').lastIndexOf('/') + 1);
};

/**
*
*/
BuildUrl.prototype.getPath = function() {
	return this.path;
};

/**
 *
 */
BuildUrl.prototype.getParameter = function(key) {
	return this.params[key];
};

/**
 *
 * @returns
 */
BuildUrl.prototype.getParameters = function() {
	return this.params;
};

/**
 *
 * @param key
 * @param values
 * @param override {boolean} True if values are not multi evaluated. Default is true
 * @returns {BuildUrl}
 */
BuildUrl.prototype.addParameters = function(key, values, override) {
	if (this.params[key] == null || override == true) {
		this.params[key] = values;
	} else {
		for (var i = 0; i < values.length; i++) {
			this.addParameter(key, values[i], override);
		}
	}
	return this;
};

/**
 *
 * @param key
 * @param value
 * @param override {boolean} True if values are not multi evaluated. Default is true
 * @returns {BuildUrl}
 */
BuildUrl.prototype.addParameter = function(key, value, override) {
	if (this.params[key] == null || override == true) {
		this.params[key] = [value];
	} else {
		if (this.params[key].indexOf(value) == -1) {
			this.params[key].push(value);
		} else {
			// value already in the array
		}
	}
	return this;
};

BuildUrl.prototype.removeParameter = function(key) {
	delete this.params[key];
};


BuildUrl.prototype.clearRefinements = function(feedIds, facetId) {
	facetId = 'f/'+facetId+'/';
	if (typeof feedIds == 'string') {
		feedIds = [feedIds];
	}
	for (var i = 0; i < feedIds.length; i ++) {
		this.removeParameterWithPrefixedValue_(feedIds[i]+ BuildUrl.REFINE_CATEGORY_PARAMETER, facetId);
		this.removeParameterWithPrefixedValue_(feedIds[i]+ BuildUrl.CANCEL_CATEGORY_PARAMETER, facetId);
		this.removeParameterWithPrefixedValue_(feedIds[i]+ BuildUrl.ZAP_CATEGORY_PARAMETER, facetId);
	}
};

BuildUrl.prototype.removeParameterWithPrefixedValue_ = function (key, prefix) {
	if (this.params.hasOwnProperty(key)) {
		for (var j = this.params[key].length-1; j >= 0; j --) {
			if (this.params[key][j].indexOf(prefix) >= 0) {
				this.params[key].splice(j, 1);
			}
		}
	}
};

BuildUrl.prototype.removeParameterWithValue_ = function (key, value) {
	if (this.params.hasOwnProperty(key)) {
		for (var j = this.params[key].length-1; j >= 0; j --) {
			if (this.params[key][j] == value) {
				this.params[key].splice(j, 1);
			}
		}
	}
};

/**
 *
 * @param queryString
 * @param override {boolean} True if values are not multi evaluated. Default is true
 * @returns {BuildUrl}
 */
BuildUrl.prototype.setQueryString = function(queryString, override) {
	this._parseParams(queryString, override);
	return this;
};

/**
 *
 * @param url
 * @param override {boolean} True if values are not multi evaluated. Default is true
 * @returns {BuildUrl}
 */
BuildUrl.prototype.setUrl = function(url, override) {
        if (url != null && url != '') {
	        var anchorSplit = url.split('#');
		var sp = anchorSplit[0].split('?');
		this.path = sp[0];
		this._parseParams(sp[1], override);
	}
	return this;
};

/**
 * Returns the url with all its parameters
 */
BuildUrl.prototype.toString = function() {
	var url = (this.path || ''),
		queryStringArr = [];

	for (var key in this.params) {
		if (this.params.hasOwnProperty(key)) {
			for (var i = 0; i < this.params[key].length; i++) {
				queryStringArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.params[key][i]));
			}
		}
	}
	if (queryStringArr.length > 0) {
		url += '?' +  queryStringArr.join('&');
	}
	return url;
};

BuildUrl.prototype._parseParams = function(qstr, override) {
	if (qstr != null && qstr != '') {
		// make sure we only have the query string as IE6/IE7 sometimes
		// automatically transform relative path to absolute URL
		if (qstr.indexOf('?') != -1) {
			qstr = qstr.substr(qstr.indexOf('?') + 1);
		}

		var parsedParams = {};
		var params = qstr.split('&');
		for (var i = 0, length = params.length; i < length; i++) {
			var param = params[i].split('=');
			var key = decodeURIComponent(param[0]);
			var value = (param.length == 2 ? decodeURIComponent(param[1].replace(/\+/g, '%20')) : '');

			if (parsedParams[key] === undefined) {
				parsedParams[key] = [];
			}
			parsedParams[key].push(value);
		}

		for (var key in parsedParams) {
			if (parsedParams.hasOwnProperty(key)) {
				this.addParameters(key, parsedParams[key], override);
			}
		}
	}
};
