window.Comments360Service = (function($, undefined) {
	

	// The doc-storage client
	var db;
	
	//map wuid => storageKey
	var stoKeys = {};
	
	// All widgets indexed on docUrl
	var widgets = {};
	
	// Reverse lookup
	// Looks up docUrl based on widgetid
	var rWidgets = {};
	
	function isUnsanitized(str) {
		return str.match(/<|>/g) != null;
	}
	
	function cleanDocumentList(array) {
		
		//sort object array needs to redefine sort function
		var out = array.sort(function(a,b){
			if(a.docUrl == b.docUrl){
				if(a.docSource == b.docSource){
					if(a.docBuildGroup == b.docBuildGroup){
						return 0;
					}
					return (a.docBuildGroup < b.docBuildGroup) ? -1 : 1;
				}
				return (a.docSource < b.docSource) ? -1 : 1;
			}
			return (a.docUrl < b.docUrl) ? -1 : 1;
		});

		// weed out duplicates
		var withoutDuplicates = [];
		for ( var i = 0; i < out.length; i++) {
			if (withoutDuplicates.length === 0	|| !(
					withoutDuplicates.slice(-1)[0].docUrl === out[i].docUrl &&
					withoutDuplicates.slice(-1)[0].docSource === out[i].docSource && 
					withoutDuplicates.slice(-1)[0].docBuildGroup === out[i].docBuildGroup)
			) {
				withoutDuplicates[withoutDuplicates.length] = out[i];
			}
		}
		return withoutDuplicates;
	}
	
	// Event handlers
	
	function onFormSubmit(e) {
		var name = $(this).find("input.name").val();
		var body = $(this).find("textarea[name='body']").val();
		var $wid = wid(this);
		
		if (!name || !body) {
			return false;
		}
		
		// hide the form
		toggleDisplayForm.call(this);
		
		var value = {
			name: name.escapeHTML(),
			timeMs: ("" + new Date().getTime()),
			body: body.escapeHTML()
		};
		
		
		// Store JSON value
		db.put($wid.docBuildGroup,$wid.docSource,$wid.docUri, stoKeys[$wid.wuid], $.toJSON(value), function() {
			refreshAll(renderItems);
			if ($wid.storageKeyCount) {
				//update Comments count
				db.get($wid.docBuildGroup,$wid.docSource,$wid.docUri, stoKeys[$wid.wuid] ,function(){
					db.set($wid.docBuildGroup,$wid.docSource, $wid.docUri,$wid.storageKeyCount, arguments[0].length.toString());
				});
			}
		});
		
		// Store on meta name if existent
		if (wid(this).storageKey) {
			db.put($wid.docBuildGroup,$wid.docSource, $wid.docUri, $wid.storageKey, getIndexValue(value));
		}
		
		$(this).find("textarea[name='body']").val('');
		if (!wid(this).forceUserName) {
			$(this).find("input.name").val('');
		}
		
		return false;
	}
	
	function toggleDisplayForm() {
		$(this).parents(".comments-wrapper").find('div.comments-form').toggle(200);
		$(this).parents(".comments-wrapper").find('a.addcomment').toggleClass("inactive");
		if ($(this).parents('.comments-wrapper').find('input[name="name"]').attr('disabled') === 'disabled') {
			// focus on message input box
			$(this).parents(".comments-wrapper").find("textarea[name='body']").focus();
		} else {
			// focus on name input box
			$(this).parents(".comments-wrapper").find("input[name='name']").focus();
		}
		return false;
	}
	
	function toggleDisplayRemaining() {
		if ($(this).parents(".comments-wrapper").find('ul.commentslist li').hasClass('hidden')) {
			$(this).parents(".comments-wrapper").find('ul.commentslist li').removeClass("hidden");
			$(this).parents(".comments-wrapper").find('a.toggleremaining').hide();
		}
		return false;
	}
	
	
	// Utility functions
	
	function wid(element) {
		var wuids = getWUIDs();
		var widgetComment = $(element).parents(".comments-wrapper");
		
		for (var i = 0; i < wuids.length; i++) {
			if(widgetComment.hasClass(wuids[i])){
				widgetWuid = wuids[i];
				break;
			}
		}
		
		if(typeof(widgetWuid) !== 'undefined') {
			return widgets[widgetWuid][rWidgets[widgetWuid][widgetComment.attr('id')]];
		}
	}
	
	/**
	 * The value that gets put in the index
	 */
	function getIndexValue(json) {
		return json.name + ": " + json.body;
	}
	
	function getStorageKeys(){
		var values = [];
		for (var key in stoKeys){
			values.push(stoKeys[key]);
		}
		return values;
	}
	
	function getWUIDs(){
		var keys = [];
		for (var key in stoKeys){
			keys.push(key);
		}
		return keys;
	}
	
	function getWidget(docUrl){
		var wuids = getWUIDs();
		for (var i = 0; i < wuids.length; i++) {
			if(typeof(widgets[wuids[i]][docUrl] != 'undefinded')) {
				return widgets[wuids[i]][docUrl];
			}
		}
		return {};
	}
	
	function refresh(wuid, callback){
		var callback = typeof(callback) === 'function' ? callback : $.noop;

		var docsInfo = cleanDocumentList(getDocsInfo(widgets,wuid));

		db.getMany(docsInfo, [wuid] , function(items) {
			callback(items);
		});
	}
	
	function refreshAll(callback) {
		var callback = typeof(callback) === 'function' ? callback : $.noop;

		var docsInfo = cleanDocumentList(getDocsInfo(widgets));

		db.getMany(docsInfo, getStorageKeys() , function(items) {
			callback(items);
		});
	}
	
	function getDocsInfo(widgets,wuid) {
		var docsInfo = [];
		var wuids = [];
		
		if(typeof(wuid) !== 'undefined') {
			wuids = [wuid];
		}
		else {
			wuids = getWUIDs();
		}
		
		for (var i = 0; i < wuids.length; i++) {
			for (var widgetobj in widgets[wuids[i]]) {
				var widgetInfo = widgets[wuids[i]][widgetobj];
				docsInfo[docsInfo.length] = {
					docBuildGroup : widgetInfo.docBuildGroup,
					docSource : widgetInfo.docSource,
					docUrl : widgetInfo.docUri,
					wuid : wuids[i]
				};
			}
		}
		
		return docsInfo;
	}
	
	function countDuplicateKeys(keyMap){
		var nbDuplicate = 0;
		var tmpmap = {};
		
		for(key in keyMap){
			if(typeof(tmpmap[keyMap[key]]) !== 'undefined')
				nbDuplicate++;
			tmpmap[keyMap[key]] = {};
		}
		return nbDuplicate;
	}
	
	/**
	 * Outputs 'items' to the DOM
	 * Purges old entries
	 */
	function renderItems(items) {
		
		//gets comments
		var docsInfo = getDocsInfo(widgets);

		for (var i = 0; i < docsInfo.length; i++) {
			var docUrl = docsInfo[i].docUrl;
			var wuid = docsInfo[i].wuid;
			var html = [];
			var widgetInfo = widgets[wuid][docUrl];
			if (items[docUrl] && items[docUrl][stoKeys[wuid]]) {
				var comments = items[docUrl][stoKeys[wuid]].map(function(elm) {
					if (elm && elm.value) {
						try {
							elm.value = $.evalJSON(elm.value);
						} catch (e) {}
					}
					return elm;
				}).sort(function(lft, rgt) {
					return parseInt(rgt.value.timeMs, 10) - parseInt(lft.value.timeMs, 10);
				});
				
				// find unsanitized entries
				var toDelete = comments.filter(function(elm) {
					return isUnsanitized(elm.value.body) || isUnsanitized(elm.value.name);
				}) || [];
								
				// Purge old entries only when storagekey is used by 1 widget.
				if (comments.length > widgetInfo.maxStore && countDuplicateKeys(stoKeys) == 0 ) {
					var negativeIx = widgetInfo.maxStore - comments.length;;
					toDelete = toDelete.concat(comments.slice(negativeIx));
					comments.splice(negativeIx, -negativeIx);
				}
				
				if (toDelete.length > 0) {
					for (var k = 0; k < toDelete.length; k++) {
						var rmwidget = getWidget(docUrl);
						db.del(rmwidget.docBuildGroup, rmwidget.docSource, docUrl, toDelete[k].key);
					}
				}
				
				
				// Display 'show all' link ?
				if (comments.length > widgetInfo.maxDisplay) {
					$("#" + widgetInfo.widgetId).find("a.toggleremaining").show();
				}
				$("#" + widgetInfo.widgetId).find(".comments-count").html("("+comments.length+")");
				
				for (var j = 0; j < comments.length; j++) {
					html[html.length] = populateTemplate(wuid, comments[j].value, j >= widgetInfo.maxDisplay);
				}
			} else {
				html[html.length] = "<li class='quiet'>No comments</li>";
			}
			
			// output html
			$("#" + widgetInfo.widgetId).find("ul.commentslist").html(html.join(''));
		}
	}
	
	function populateTemplate(wuid, item, hidden) {
		var template = $("#comments-template-" + wuid).html();
		template = template.replace("{{name}}", item.name);
		template = template.replace("{{body}}", item.body);
		template = template.replace("{{date}}", getFormattedDate(new Date(parseInt(item.timeMs, 10))));
		template = template.replace("hidden-class", hidden ? "hidden" : "");
		return template;
	}
	
	function getFormattedDate(dateObj){
		return dateObj.toISO8601Date() + ' ' + dateObj.toLocaleTimeString();
	}
	
	function registerEventHandlers() {
		for(var key in stoKeys) {
			$("." + key + " div.comments-form form").submit(onFormSubmit);
			$("." + key + " a.addcomment").click(toggleDisplayForm);
			$("." + key + " a.toggleremaining").click(toggleDisplayRemaining);
		}
	}
	
	return {
		registerWidget: function registerWidget(wuid, options) {						
			if (options.storageKeyCount) {
				options.storageKeyCount = options.storageKeyCount.replace('[]', '');
			}
			options.wuid = wuid;
			widgets[wuid][options.docUri] = options;
			rWidgets[wuid][options.widgetId] = options.docUri;
			if (options.forceUserName) {
				$("#" + options.widgetId).find("input.name").val(options.forceUserName);
				$("#" + options.widgetId).find("input.name").attr('disabled', 'disabled');
			}
		},
		init : function init(wuid, storageKey){
			delete widgets[wuid];
			widgets[wuid] = {};
			delete rWidgets[wuid];
			rWidgets[wuid] = {};
			stoKeys[wuid] = storageKey;
		},
		start: function start() {
			db = new StorageClient('document');
			registerEventHandlers();
			refreshAll(renderItems);
		}
	};
	
})(jQuery);