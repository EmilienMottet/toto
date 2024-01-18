/**
 * 360 Storage Collaborative Tagging System
 * 
 * Uses a global object 'Tagging360Service' that exposes two methods: -
 * registerWidget(options) Called by each widget using the tagging service. For
 * more detailed information on what goes in 'options' look at the method's
 * signature - start() Registers the event-handlers and fetches all the tags,
 * called after all widget's have been registered using registerWidget()
 * 
 * @author blindfor
 */
(function($, undefined) {

	// Initialization guard
	if (window.Tagging360Service !== undefined) {
		throw new Error("window.Tagging360Service already taken, was",
				window.Tagging360Service);
	}

	var tagClasses = [ 'orangetag', 'lbluetag', 'greentag', 'purpletag',
			'bluetag', 'redtag' ];
	var deniedTagChars = /<|>/gi;
	var onClickTagPlaceholder = "%{tag}";
	var editText = mashupI18N.get("tagging","edit-text");
	var addText = mashupI18N.get("tagging","tag-this");
	var editFormInnerHTML = '<form><input type="text" class="text" /><input type="submit" class="button" value="'+mashupI18N.get("tagging","add")+'" />'
			+ '&nbsp;'+mashupI18N.get("tagging","or")+' <a class="close-nosave" href="#!">'+mashupI18N.get("tagging","close")+'</a>.</form><p>'+mashupI18N.get("tagging","help-text")+'</p><p class="error"></p>';
	var documents = {}; // keeps global state about all tagging-containers

	var $template = $('' +
            '<ul>' + 
            '    <li class="{{cssclass}}">' + 
            '        <div class="tagwrapper">' + 
            '                <div class="endsection section first"></div><div class="midsection section">' + 
            '                        <span class="name">{{tag}}</span>' + 
            '                        <span class="key">{{db_key}}</span>' + 
            '                        <span class="delete">| <a href="#!">x</a></span>' + 
            '                </div><div class="endsection section last"></div>' + 
            '        </div>' + 
            '    </li>' + 
            '</ul>');

	/**
	 * Fetches the first storageKey from docs, returns it
	 */
	function getAllStorageKeys(docs) {
		var obj = {};
		for ( var wid in docs) {
			if (docs[wid].storageKey !== undefined) {
				obj[docs[wid].storageKey] = {};
			}
		}
		var keys = [];
		for ( var key in obj) {
			keys[keys.length] = key;
		}
		return keys;
	}

	function refreshAllTags() {
		refreshTagsForDocuments(documents);
	}

	function refreshTagsForDocuments(docs, displayDelete) {
		/**
		 * Get all doc URIs given 'documents'
		 */
		function getDocsInfo(docs) {
			var out = [];
			for ( var wid in docs) {
				if (docs.hasOwnProperty(wid)
						&& $('#' + docs[wid].widgetId).length > 0) {
					out[out.length] = {
						docBuildGroup : docs[wid].docBuildGroup,
						docSource : docs[wid].docSource,
						docUrl : docs[wid].docUri
					};
				}
			}
			//sort object array needs to redefine sort function
			out = out.sort(function(a,b){
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

		db.getMany(getDocsInfo(docs), getAllStorageKeys(docs), function(data) {
			for (wid in docs) {
				var widget = docs[wid];
				// IF there is a response for this widget
				// AND if there is an entry for the storage Key
				if (data[widget.docUri]
						&& data[widget.docUri][widget.storageKey]) {
					var items = data[widget.docUri][widget.storageKey];
					renderTagsForDocument(widget, items, displayDelete);
				} else {
					$("#" + widget.widgetId).find("ul.taglist").html("");
				}
			}
		});

	}
	

	function renderTagsForDocument(doc, items, displayDelete) {
		var html = [];
		var widget = $("#" + doc.widgetId);

		for ( var i = 0; i < items.length; i++) {
			var template = $template.html();
			template = template.replace("{{cssclass}}", getTagCssClass(
					doc.docUri, items[i].value));
			template = template.replace("{{db_key}}", items[i].key);

			// because some browsers urlencode the href attribute of 'a' tags
			if (doc.onClickUrl) {
				template = template.replace("{{tag}}", '<a href="'
						+ doc.onClickUrl.replace(onClickTagPlaceholder,
								encodeURIComponent(items[i].value)) + '">' + items[i].value
						+ '</a>');
			} else {
				template = template.replace("{{tag}}", '<a href="#!">' + items[i].value
						+ '</a>');
			}

			html.push(template);
		}

		// output all the HTML into the DOM
		widget.find('ul.taglist').html(html.join(''));
		widget.find('a.edittags').html(items.length > 0 ? editText : addText);

		if (doc.onClickUrl) {
			widget.find('ul.taglist').addClass('taglink');
		}

		// enable delete?
		if (displayDelete)
			widget.find('span.delete').click(onClickDelete).show();
	}
	;

	/**
	 * Get tag CSS class given doc_id + tag name
	 */
	function getTagCssClass(id, name) {
		var sum = 0;

		for ( var i = 0; i < name.length; i++) {
			sum += name.charCodeAt(i);
		}

		return tagClasses[sum % tagClasses.length];
	}
	
	// Event handlers
	function onClickEditTags() {
		var $this = $(this);
		var $editdiv = $this.siblings("div.edittags-form");
		
		$editdiv.html(editFormInnerHTML);
		$editdiv.find('input.button').click(onFormSubmit);
		$editdiv.find('input.text').submit(onFormSubmit);
		$editdiv.find('input.text').val('');
		$editdiv.find('a.close-nosave').click(onClickNoSave);
		

		$editdiv.slideDown('fast', function() {
			$(this).find('input.text').focus();
		});
		
		$this.parents('.tagging-wrapper').find('span.delete').click(onClickDelete).show();
		$this.hide();

		return false;
	}

	function onFormSubmit() {
		var $this = $(this).closest('form');
		var wId = $.trim($this.parents('.tagging-wrapper').attr('id'));
		var widget = $("#" + wId);
		var tags = $.trim($this.children('input.text').val()).split(',');
		var oldTags = [];

		$this.siblings('.error').empty().hide();

		// collect previously defined tags
		widget.find("ul.taglist li span.name a").each(function(i, elm) {
			oldTags.push($.trim(elm.innerHTML));
		});

		// lowercase and trim
		tags = $.map(tags, function(e) {
			return $.trim(e).toLowerCase();
		});

		// filter out empty items & previously existing & math deniedTagChars
		tags = tags.filter(function(e) {
			return e != "";
		});

		// to aid in duplicate-hunting
		tags.sort();

		// validate input
		for ( var i = 0; i < tags.length; i++) {
			var prevTag;

			// does the tag occur twice in 'tags' ?
			if (tags[i] == prevTag) {
				$this.siblings('.error').html(mashupI18N.get("tagging","error-twice")+ ": " + tags[i]).show();
				return false;

				// does it contain unwanted characters ?
			} else if (tags[i].match(deniedTagChars)) {
				$this.siblings('.error').html(mashupI18N.get("tagging","error-invalid")).show();
				return false;

				// does it already exist for the document ?
			} else if ($.inArray(tags[i], oldTags) != -1) {
				$this.siblings('.error').html(mashupI18N.get("tagging","error-duplicate") + ": " + tags[i]).show();
				return false;
			}
			prevTag = tags[i];
		}

		var count = 0;
		function countAndExecute() {
			if (++count == tags.length) {
				refreshTagsForDocuments([ documents[wId] ]);
			}
		}

		for ( var i = 0; i < tags.length; i++) {
			db.put(documents[wId].docBuildGroup, documents[wId].docSource,
					documents[wId].docUri, documents[wId].storageKey, tags[i]
							.toLowerCase(), countAndExecute, countAndExecute);
		}

		$this.parent().slideUp('fast');
		$this.parents('.tagging-wrapper').children('.edittags').show();
		$this.parents('.tagging-wrapper').find('span.delete').hide();		

		return false;
	}

	function onClickNoSave() {
		var $this = $(this);
		$this.parents('.tagging-wrapper').find('.edittags').show();
		$this.parents('.tagging-wrapper').find('span.delete').hide();
		$this.parents('.edittags-form').slideUp('fast');
		return false;
	}

	function onClickDelete() {
		var $this = $(this);
		var wid = $this.parents('.tagging-wrapper').attr('id');

		// delete the tag from database
		db.del(documents[wid].docBuildGroup, $.trim(documents[wid].docSource),
				$.trim(documents[wid].docUri), $.trim($this
						.siblings("span.key").html()), function() {
					refreshTagsForDocuments([ documents[wid] ], true);
				});

		// prevent default link behavior
		return false;
	}

	window.Tagging360Service = {

		/**
		 * Registers a new sub-widget. After all widgets have been registered,
		 * call start()
		 */
		registerWidget : function(doc) {
			if (documents[doc.widgetId] == undefined) {
				documents[doc.widgetId] = doc;
			}
		},

		/**
		 * Start the tagging service. - Attaches event handlers, - Initializes
		 * the storage engine and - issues an HTTP request fetching the tags
		 */
		start : function() {
			// Initialize 360-storage client
			db = new StorageClient('document');

			// Bind event handlers
			$('.tagging-wrapper .edittags').click(onClickEditTags);

			// Fetch tags
			refreshAllTags();
		}
	};

})(jQuery);