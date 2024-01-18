/**
 * 360 Storage Client
 *
 * @author blindfor
 */
(function($) {
	if (window.StorageClient !== undefined) {
		throw new Error("Can't instantiate: window.StorageClient is already taken");
	}

	var errRegexpSplit = /\s*\n\s*/;
	var newlineSplit = "\n";
	var singleTarget = /^single$/;
	var twoTarget = /^(single|bag)$/;
	var allTarget = /^(single|bag|bag_elem)$/;
	var proxyRelativePath = "/storage";
	var defaultServicePath = window.mashup.baseUrl.replace(/\/$/, '') + proxyRelativePath;

	/**
	 * Defines what targets are valid per storage operation.
	 *
	 * single: targets a single, non-bag entity e.g
	 * .../document/get/doc_id/lasteditedby bag: targets a bag (collection of
	 * values) e.g .../document/get/todolist[] bag_elem: targets a bag element
	 * e.g .../document/get/todolist[]/f2487cg9bv
	 */
	var validTargets = {};
	validTargets['get'] = allTarget;
	validTargets['set'] = allTarget;
	validTargets['set-many'] = allTarget;
	validTargets['put-many'] = allTarget;
	validTargets['delete'] = allTarget;
	validTargets['enumerate'] = singleTarget;
	validTargets['put'] = twoTarget;
	validTargets['get-or-put'] = singleTarget;

	/**
	 * Looks up default request values based on resource
	 */
	var requestDefaultLookup = {
		document : {
			resType : "document",
			isDocument : true
		},

		user : {
			resType : 'user',
			resId : 'me',
			isDocument : false
		},

		shared : {
			resType : "global",
			resId : "shared",
			isDocument : false
		}
	};

	/**
	 * Default options in case no 'options' parameter is supplied/ if key not
	 * found in 'options' object parameter
	 */
	var defaultOptions = {
		applicationId : "",
		"timeout" : 30000,

		/**
		 * Default 'error' function.
		 *
		 * Executed on completed XmlHttpRequest non-2xx HTTP responses.
		 *
		 * @param stCode
		 *            HTTP status code
		 * @param xmlHttp
		 *            XmlHttpRequest object
		 * @param errType
		 *            Error Type
		 * @param errTxt
		 *            Descriptive text
		 */
		defaultErrorCallback : function(stCode, xmlHttp, errType, errTxt) {
			log("ERROR", stCode, errType, errTxt);
		},

		/**
		 * Default 'success' function.
		 *
		 * Executed on completed XmlHttpRequest 2xx HTTP responses
		 *
		 * @param response
		 *            Array containing 0:N objects of: key: resType:
		 *            key_fragment resId: key_fragment key: key_fragment value:
		 *            the response value as text
		 * @param xmlHttp
		 *            XmlHttpRequest object
		 */
		defaultSuccessCallback : function(response, xmlHttp) {
			log("SUCCESS", xmlHttp.status, response);
		}
	};

	/**
	 * Handles jQuery.ajax()'s responses.
	 *
	 * Calls 'success' or 'error' depending on status code
	 */
	var onCompleteHandler = function(success, error, customProcessing) {
		var dataProcessing = customProcessing || responseBodyToArray;

		return function(xmlHttp, txtStatus) {
			if ( txtStatus === "success" || txtStatus === "notmodified" || txtStatus === "nocontent") {
				success(dataProcessing(xmlHttp.responseText, xmlHttp), xmlHttp);
			} else {
				log("HTTP Error", xmlHttp, txtStatus);
				var errorArray = txtStatus !== "timeout" ? xmlHttp.responseText.split(errRegexpSplit) : [ "ERR_TIMEOUT","The request timed out." ];
				error(xmlHttp.status, xmlHttp, $.trim(errorArray[0]), $.trim(errorArray[1]));
			}
		};
	};

	/**
	 * Converts the flat result set to a map of resId => key => value(s)
	 */
	var multiGetDataProcessor = function(responseText, xmlHttp) {
		var responseArray = responseBodyToArray(responseText, xmlHttp);
		var map = {};

		for ( var i = 0; i < responseArray.length; i++) {
			var entry = responseArray[i];
			var keys = entry.key.split('|');
			var e = {
				key : keys.length > 1 ? keys[0] + '|' + keys[1] : keys[0],
				value : entry.value
			};
			if (!map[entry.resId]) {
				map[entry.resId] = {};
			}
			if (!map[entry.resId][keys[0]]) {
				map[entry.resId][keys[0]] = [];
			}
			map[entry.resId][keys[0]].push(e);
		}

		log('Multi get output:', map);
		return map;
	};

	var processAggregateResult = function(responseText, xmlHttp) {
		return eval(responseText);
	};
	
	/**
	 * Converts the XmlHttpResponse object to an array of entries.
	 */
	var responseBodyToArray = function(textBody, xmlHttp) {
		var output = [];
		log(textBody);

		// Chunked formatting O:M entries returned
		var startIndex = 0;

		// Loop on all entries in HTTP response text
		while (startIndex < textBody.length) {
			// move cursor to the 4:th newline (between blob-length and blob itself)
			var newlineIndex = indexOf(textBody, newlineSplit, 5, startIndex);
			if (newlineIndex === -1) {
				throw new Error("Encountered response of invalid format: indexOf returned -1");
			}
			// slice out keyset + length of data block from startIndex to newlineIndex
			var meta = textBody.slice(startIndex, newlineIndex - 1).split(newlineSplit);
			if (meta === undefined || !(meta instanceof Array) || meta.length != 5) {
				log("meta not on valid format", meta);
				throw new Error("meta not on valid format");
			}

			// move start cursor to first char of data block
			startIndex = newlineIndex;

			var entity = {
				resType : meta[0],
				resId : meta[1],
				key : meta[2],
				value : null
			};

			// add unique portion
			if (meta[3] != '-') {
				entity.key += "|" + meta[3];
			}

			// extract data
			var blobLength = parseInt(meta[4].split(":")[1], 10);
			if (blobLength > 0) {
				entity.value = textBody.substr(startIndex, blobLength);
			}
			output[output.length] = entity;
			startIndex += blobLength;
			// skip trailing newlines
			while (textBody.charAt(startIndex) == newlineSplit) {
				startIndex++;
			}
		}
		return output;
	};

	/**
	 * Converts an array-like object (arguments, object, ...) to an array.
	 *
	 * @param toArray
	 *            the non-array object to convert
	 * @param [optional]
	 *            beginIndex index of the first element of the new array
	 * @returns array copy of 'toArray' from beginIndex
	 */
	var makeArray = function(toArray, beginIndex) {
		var start = beginIndex || 0;
		return Array.prototype.slice.call(toArray, start);
	};

	/**
	 * Like "String".indexOf() but finds the n:th value in string, from
	 * 'fromIndex'.
	 */
	var indexOf = function(str, searchValue, nthValue, fromIndex) {
		while (nthValue--) {
			fromIndex = str.indexOf(searchValue, fromIndex) + 1;
			if (fromIndex === 0) {
				return -1;
			}
		}
		return fromIndex;
	};

	/**
	 * Builds the URL for the request.
	 *
	 * Output URL based on keyset, target method, and service URL.
	 */
	var buildUrlFromKeyset = function(base, operation, keyset) {
		var pathFragments = [];
		var i = 0;
		pathFragments[i++] = base;
		pathFragments[i++] = keyset.resType;
		pathFragments[i++] = operation;
		pathFragments[i++] = keyset.resId[0];

		if (keyset.key.length > 0) {
			pathFragments[i++] = keyset.key[0];
		}

		var finalPath = pathFragments.join('/');

		log("Built URL", finalPath);

		return finalPath;
	};

	/**
	 * Light logging wrapper, silently discards logs if no // console.log exists
	 */
	var log = function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift("StorageClient");
		// if (window && window.console) {
		// window.console.log.apply(null, args);
		// }
	};

	/**
	 * Checks if string 'str' ends with '[]'
	 */
	var isBagTarget = function(str) {
		return /\[\]$/.test(str);
	};

	/**
	 * Instantiates a new StorageClient, bound to a resourceType
	 *
	 * @param resourceType
	 *            The type of resource that the storage should be bound to, can
	 *            be either document, shared or user. Note: if 'document' the
	 *            optional 'documentsource' parameter should be specified
	 *
	 * @param [optional]
	 *            url URL to the storage proxy. If none specified the path html
	 *            meta[name=baseurl] is assumed to contain the URL
	 *
	 * @param [optional]
	 *            documentBuildGroup The build group, of the document goes here.
	 *            Needed for re-push from cache functionality.
	 *
	 * @param [optional]
	 *            documentSource The connector's name, or source, of the
	 *            document goes here. Needed for re-push from cache
	 *            functionality.
	 *
	 * @param [optional]
	 *            options additional options, object of: applicationId: APP_ID
	 *            to use for namespacing storage - defaults to "default" NOTE:
	 *            Does nothing when communicating through proxy, the proxy uses
	 *            its own APP_ID defaultErrorCallback(stCode, XmlHttpRequest,
	 *            errEnum, errTxt): default callback for errors
	 *            defaultSuccessCallback(data, XmlHttpRequest): default callback
	 *            for successful requests timeout: The timeout of the request in
	 *            ms
	 */
	var StorageClient = window.StorageClient = function(resourceType, url, options) {

		// To guard against forgetting the 'new' operator when instantiating
		if (!(this instanceof StorageClient)) {
			return new StorageClient(resourceType, url, documentBuildGroup, documentSource, options);
		}

		if (typeof (resourceType) != "string" || requestDefaultLookup[resourceType] === undefined) {
			throw new Error("resourceType parameter needs to be a String & needs to exist in defaultResourceLookup");
		}

		if (typeof (options) == "object") {
			// 2:nd parameter given, parse options
			for (key in defaultOptions) {
				if (options[key] == undefined) {
					options[key] = defaultOptions[key];
				}
			}
		} else {
			options = defaultOptions;
		}

		if (typeof (url) == "string") {
			options.baseUrl = url;
		} else {
			options.baseUrl = defaultServicePath;
		}

		options.resType = resourceType;

		this.options = options;
		this.requestTemplate = requestDefaultLookup[resourceType];
		log("360 Storage Client using path: " + options.baseUrl);
		log("Loaded options", this.options);
		log("Loaded Request Template", this.requestTemplate);
	};

	StorageClient.prototype = {

		constructor : StorageClient,

		// Non-destructive operations
		// Does not alter the state of the database

		/**
		 * Gets the bag/entity for a single key
		 *
		 * @param [optional]
		 *            documentId: Only for DOCUMENT-bound storage, otherwise
		 *            ignored
		 * @param key
		 *            (or key|unique) The key whose value to get
		 */
		get : function() {
			var request = this._buildRequest(makeArray(arguments), 'get', false, true, true);
			this._doGet(request);
		},

		/**
		 * Gets the values for 1:M keys.
		 *
		 * Gets all permutations of the given documents/ keys
		 *
		 * @param [optional]
		 *            Array of documents object (docBuildGroup,docSource,docUrl)  Only for DOCUMENT-bound storage,
		 *            otherwise ignored
		 * @param Array of keys Keys whose values to get
		 *
		 * @return Map of resId => key => values
		 */
		getMany : function() {
			var args = makeArray(arguments);

			if (this.requestTemplate.resId !== undefined) {
				docs = [ this.requestTemplate.resId ];
			} else {
				docs = args.shift();
				if (!$.isArray(docs)) {
					throw new Error("Expected array as argument, got ", docs);
				}
			}

			key = args.shift();
			if (typeof (key) === 'string') {
				key = [ key ];
			} else if (!$.isArray(key)) {
				throw new Error("Expected array or string as argument, got ", key);
			}

			var request = {
				url : [ this.options.baseUrl, this.requestTemplate.resType, 'get-many' ],
				params : {
					docs : [],
					bg : [],
					src : [],
					res_id : [],
					key : key
				},
				success : args.shift() || defaultOptions.defaultSuccessCallback,
				error : args.shift() || defaultOptions.defaultErrorCallback
			};

			if (typeof (docs[0]) === 'string') {
				request.params.res_id = docs;
			} else {
				for ( var i = 0; i < docs.length; i++) {
					request.params.bg[i] = docs[i].docBuildGroup;
					request.params.src[i] = docs[i].docSource;
					request.params.res_id[i] = docs[i].docUrl;
				}
			}

			// dispatch query
			this._doGet(request, multiGetDataProcessor);
		},

		/**
		 * Gets All key-values for a single target
		 *
		 * @param [optional]
		 *            documentBuildGroup the build group of the document, Only
		 *            for document-bound storage
		 * @param [optional]
		 *            documentSource the source of the document (source
		 *            connector's name), Only for document-bound storage
		 * @param
		 *            documentUrl / user
		 */
		enumerate : function() {
			var request = this._buildRequest(makeArray(arguments), 'enumerate', false, true, true, true);
			this._doGet(request);
		},
		
		/**
		 * Gets All key-values for a single target
		 *
		 * @param [optional]
		 *            documentBuildGroup the build group of the document, Only
		 *            for document-bound storage
		 * @param [optional]
		 *            documentSource the source of the document (source
		 *            connector's name), Only for document-bound storage
		 *            
		 * @param documentUrl / user
		 * 
		 * @param keys[] : Array of keys
		 * 
		 * @param aggregateFunctions[] : Array of aggregate functions ("COUNT","MIN","MAX","AVG","SUM")
		 */
		aggregate: function(){
			
			var args = makeArray(arguments);
			var params = {};
			
			// Get document 'build_group' argument, has to be String
			if (this.requestTemplate.isDocument) {
				if (typeof (args[0]) == 'string') {
					params.bg = args.shift();					
				}
			}			
			// Get document 'source' argument, has to be String
			if (this.requestTemplate.isDocument) {
				if (typeof (args[0]) == 'string') {
					params.src = args.shift();
				}
			}
			// Get RESOURCE_ID (if not defined in template), has to be String
			if (this.requestTemplate.resId === undefined) {
				// fetch resId from arguments (document)
				var resId = args.shift();
				if (typeof (resId) !== "string") {
					throw new Error("Invalid resId argument : Expected string, got ", typeof (resId), resId);
				}
				params.res_id = resId;
			} else {
				// fetch from template (user, shared)
				params.res_id = this.requestTemplate.resId;
			}
			//get key[]
			params.key = args.shift();
			if (typeof (params.key) === 'string') {
				params.key = [ params.key ];
			} else if (!$.isArray(params.key)) {
				throw new Error("Invalid 'key' argument : Expected array or string, got ", params.key);
			}
			//get aggr[]
			params.aggr = args.shift();
			if (typeof (params.aggr) === 'string') {
				params.aggr = [ params.aggr ];
			} else if (!$.isArray(params.aggr)) {
				throw new Error("Invalid 'aggr' argument : Expected array or string, got ", params.aggr);
			}
			
			var request = { 
				params: params,
				url: [ this.options.baseUrl, this.requestTemplate.resType, "aggregate" ],
				success : args.shift() || defaultOptions.defaultSuccessCallback,
				error : args.shift() || defaultOptions.defaultErrorCallback
			};
			
			this._doGet(request, processAggregateResult);
		},		
		
		// Destructive operations
		// Alters the state of the databasee

		/**
		 * Set a value in the datastore, overwriting the previous value, if any.
		 *
		 * @param [optional]
		 *            documentBuildGroup the build group of the document, Only
		 *            for document-bound storage
		 * @param [optional]
		 *            documentSource the source of the document (source
		 *            connector's name), Only for document-bound storage
		 * @param [optional]
		 *            documentUrl
		 * @param key
		 *            (or key|unique)
		 * @param value
		 */
		set : function() {
			var request = this._buildRequest(makeArray(arguments), 'set', true,
					true, true);
			this._doPost(request);
		},
		
		/**
		 * Set values in the datastore, clear all previous values for this key.
		 *
		 * @param [optional]
		 *            documentBuildGroup the build group of the document, Only
		 *            for document-bound storage
		 * @param [optional]
		 *            documentSource the source of the document (source
		 *            connector's name), Only for document-bound storage
		 * @param [optional]
		 *            documentUrl
	 	 * @param key 
		 *            must be a bag( myKey[] )
		 * @param values 
		 *     		  array of string	
		 */
		setMany : function() {
			var request = this._buildRequest(makeArray(arguments), 'set-many', true, true, true);
			this._doPost(request);
		},

		/**
		 * Put a value in the datastore, fails if previous value exist.
		 *
		 * @param [optional]
		 *            documentBuildGroup the build group of the document, Only
		 *            for document-bound storage
		 * @param [optional]
		 *            documentSource the source of the document (source
		 *            connector's name), Only for document-bound storage
		 * @param [optional]
		 *            documentUrl
		 * @param key
		 * @param value
		 */
		put : function() {
			var request = this._buildRequest(makeArray(arguments), 'put', true, true, true);
			this._doPost(request);
		},
		
		/**
		 * Put values to the datastore without any control.
		 *
		 * @param [optional]
		 *            documentBuildGroup the build group of the document, Only
		 *            for document-bound storage
		 * @param [optional]
		 *            documentSource the source of the document (source
		 *            connector's name), Only for document-bound storage
		 * @param [optional]
		 *            documentUrl
	 	 * @param key 
		 *            must be a bag( myKey[] )
		 * @param values 
		 *     		  array of string
		 */
		putMany : function() {
			var request = this._buildRequest(makeArray(arguments), 'put-many', true, true, true);
			this._doPost(request);
		},

		/**
		 * Checks if there is a value for 'key', if yes: returns that value if
		 * no: sets the supplied value and returns that
		 *
		 * @param [optional]
		 *            documentBuildGroup the build group of the document, Only
		 *            for document-bound storage
		 * @param [optional]
		 *            documentSource the source of the document (source
		 *            connector's name), Only for document-bound storage
		 * @param [optional]
		 *            documentUrl
		 * @param key
		 * @param value
		 */
		getOrPut : function() {
			var request = this._buildRequest(makeArray(arguments),
					'get-or-put', true, true, true);
			this._doPost(request);
		},

		/**
		 * Deletes a value from the storage
		 *
		 * @param [optional]
		 *            documentBuildGroup the build group of the document, Only
		 *            for document-bound storage
		 * @param [optional]
		 *            documentSource the source of the document (source
		 *            connector's name), Only for document-bound storage
		 * @param [optional]
		 *            documentUrl
		 * @param key
		 */
		del : function() {
			var request = this._buildRequest(makeArray(arguments), 'delete',
					false, true, true, false);
			this._doPost(request);
		},
		
		/**
		 * Helper methods
		 */
		_buildRequest : function(args, operation, expectsValue,
				expDocBuildGroup, expDocSource, optionalKey) {
			var requestOptions = {};
			var url = [];
			var params = {};

			// build url
			requestOptions.url = [ this.options.baseUrl,
					this.requestTemplate.resType, operation ];

			// Arg #1
			// Get document 'build_group' argument, has to be String
			// Only if using DOCUMENT storage and if expDocBuildGroup is true

			if (this.requestTemplate.isDocument && expDocBuildGroup) {
				if (typeof (args[0]) == 'string') {
					params.bg = args.shift();
					log("Using ", params.buildGroup, " as document build group");
				}
			}

			// Arg #2
			// Get document 'source' argument, has to be String
			// Only if using DOCUMENT storage and if expDocSource is true

			if (this.requestTemplate.isDocument && expDocSource) {
				if (typeof (args[0]) == 'string') {
					params.src = args.shift();
					log("Using ", params.source, " as document source");
				}
			}

			// Arg #3
			// Get RESOURCE_ID (if not defined in template), has to be String

			if (this.requestTemplate.resId === undefined) {
				// fetch resId from arguments (document)
				var resId = args.shift();
				if (typeof (resId) !== "string") {
					throw new Error("Invalid resId: Expected 'string', got: ",
							typeof (resId), resId);
				}
				params.res_id = resId;
			} else {
				// fetch from template (user, shared)
				params.res_id = this.requestTemplate.resId;
			}

			// Arg #4
			// Get KEY, has to be String

			if (optionalKey !== true && typeof (args[0]) === 'string') {
				var key = args.shift();
				if (typeof (key) !== "string") {
					throw new Error("Invalid key: Expected 'string', got ",
							typeof (key), key);
				}

				if (key.indexOf('|') == -1) {
					// single key
					params.key = key;
					requestOptions.target = isBagTarget(url[4]) ? 'bag'
							: 'single';
				} else {
					// key + unique
					key = key.split('|');

					if (key.length != 2) {
						throw new Error(
								"Invalid key: | character can only occur once (separator between key/unique), key was ",
								key);
					} else if (!isBagTarget(key[0])) {
						throw new Error(
								"Error: 'key' must end with '[]' when 'unique' is supplied, key was ",
								url[4]);
					}

					params.key = key[0];
					params.unique = key[1];
					requestOptions.target = 'bag_elem';
				}
			} else {
				requestOptions.target = 'single';
			}
			
			requestOptions.params = params;

			// check that target is allowed
			if (!validTargets[operation].test(requestOptions.target)) {
				throw new Error("Invalid target for operation: ", operation,
						validTargets[operation]);
			}

			// Arg #5
			// Get VALUE if required, has to be String

			if (expectsValue === true) {
				// load value from args
				requestOptions.value = args.shift();
				
				if (typeof (requestOptions.value) !== 'string') {
					if ($.isArray(requestOptions.value)) {
						requestOptions.value = JSON.stringify(requestOptions.value);//converts array to json
					} else {
						throw new Error("Expected array or string as argument, got ", key);
					}
				}
			}
			
			if(this.options.applicationId != "")
				params.application = this.options.applicationId;

			// Arg #6, #7
			// Set success / failure callbacks

			requestOptions.success = args.shift() || defaultOptions.defaultSuccessCallback;
			requestOptions.error = args.shift() || defaultOptions.defaultErrorCallback;

			return requestOptions;
		}, // end _buildRequest

		/**
		 * Dispatches a GET request using the preivously constructed params
		 * object
		 *
		 * @param params
		 */
		_doGet : function(params, customDataProcessing) {
			var joinedUrl = params.url.join('/');
			log("GET", joinedUrl, params);

			request = {
				url : joinedUrl,
				dataType : "text",
				complete : onCompleteHandler(params.success, params.error, customDataProcessing),
				timeout : this.options.timeout,
				type : "GET",
				cache : false
			};

			if (params.params) {
				request.url += "?" + $.param(params.params, true);
			}

			$.ajax(request);
		},

		/**
		 * Dispatches a POST request using the previously constrcuted
		 * params-object
		 *
		 * @param params
		 */
		_doPost : function(params, customDataProcessing) {
			var jurl = params.url.join('/');
			log("POST", jurl, params);

			var request = {
				url : jurl,
				dataType : 'text',
				complete : onCompleteHandler(params.success, params.error, customDataProcessing),
				timeout : this.options.timeout,
				type : "POST",
				processData : false,
				contentType: "application/octet-stream;charset=UTF-8"
			};

			if (params.params) {
				request.url += "?" + $.param(params.params, true);
			}

			// set value if exists
			if (typeof (params.value) === 'string') {
				request.data = params.value;
			}

			$.ajax(request);
		}
	};

})(jQuery);
