function TrustedQuery(url, wuid, options) {
	/* configuration */
	this.url = url;
	this.wuid = wuid;
	this.action = options.action || '';
	this.width = options.width || 350;
	this.queryVar = options.queryVar || 'q';
	this.refines = options.refines || [];
	this.cookieName = options.cookieName || 'trustedqueries';
	this.forceType = options.forceType || false;

	/* internal states */
	this.timer = null;
	this.visible = false;
	this.selected = -1;
	this.suggestions = [];

	/* constants */
	this.FIELD_SEPARATOR = ':';
	this.OPENED_FIELD_SEPARATOR = '::';
	this.keys = {
		CLICKED: 0,
		BACKSPACE: 8,
		ENTER: 13,
		UP: 38,
		DOWN: 40,
		RIGHT: 39,
		LEFT: 37,
		ESC: 27,
		SUPPR: 46
	};
}

TrustedQuery.prototype.init = function() {

	/* init widget DOM */

	this.$widget = $('.wuid.' + this.wuid);
	this.$widget.html(''
		+ '<form name="trustedForm_' + this.wuid + '" method="get" autocomplete="off" action="' + this.action + '">'
		+    '<div class="searchFieldWrapper" style="width:' + this.width + 'px">'
		+        '<div class="trustedInputTable"><div class="inputWrapper">'
		+              '<input class="trustedField" type="text" />'
		+              '<span class="trustedSpinner"></span>'
		+        '</div></div>'
		+    '</div>'
		+    '<input type="hidden" class="trustedQuery" name="' + this.queryVar + '" value="" />'
		+ '</form>'
	);

	this.$form = this.$widget.find('> form');
	this.$query = this.$form.find('> input.trustedQuery');
	this.$sfw = this.$form.find('> div.searchFieldWrapper');
	this.$wtr = this.$sfw.find('.trustedInputTable');
	this.$input = this.$wtr.find('.trustedField');
	this.$spinner = this.$sfw.find('.trustedSpinner');

	/* init suggestion DOM (common to all trusted queries) */

	if ($("#trustedWrapper").length == 0) {
		$('body').append(''
			+ '<div id="trustedWrapper" style="display:none;">'
			+    '<table class="trustedTable" cellpadding="0" cellspacing="0"></table>'
			+ '</div>'
		);
	}

	this.$topWrapper = $('#trustedWrapper');
	this.$tbl = this.$topWrapper.find('> table');

	/* init events */

	var _this = this;

	$(document).click(function() { _this.displaySuggestions(false); });
	$(window).resize(function() { _this.adjustPosition(); });

	this.$input.bind('keydown', { _this: this }, this.suggestEvent);
	this.$input.bind('click', { _this: this }, this.suggestEvent);

	// when clicking somewhere in the trusted queries, set focus to the input
	this.$sfw.bind('click', { _this: this }, function(e) {
	    e.data._this.$input.focus();
	    _this.suggestEvent(e);
	    return false;
	});

	this.attachAutoGrowEvent(this.$input);

	/* reload previous state */

	this.state = { chunks: [] };
	var chunks = this._loadChunks();
	for (var i = 0; i < chunks.length; i++) {
		this.addQueryChunk(chunks[i], false);
	}

	return this;
};

/**
 * Handles GeoInterface
 */
TrustedQuery.prototype.registerGeoInteface = function(wuid, parameter, value, meta) {
	var $geoFormInput = $('<input type="hidden" name="'+parameter+'" value="'+value+'" />');
	this.$form.append($geoFormInput);

	exa.io.register('exa.io.GeoInterface', wuid, function (geoInterface) {
		geoInterface.addOnChangedListener(function () {
			$geoFormInput.val(exa.geo.generateGeoDataElql(meta, geoInterface.getPolygons(), geoInterface.getCircles()));
		});
		if (value.length > 0) {
			var extracted = exa.geo.extractFromElql(value),
				i;
			for (i = 0; i < extracted.polygons.length; i ++) {
				geoInterface.addPolygon(extracted.polygons[i]);
			}
			for (i = 0; i < extracted.circles.length; i ++) {
				geoInterface.addCircle(extracted.circles[i]);
			}
		}
	});
};

TrustedQuery.prototype._loadChunks = function() {
	// quick check for empty query string
	if (window.location.search.length == 0) {
		return [];
	}

	// load the chunks from the cookie
	var chunks = $.cookie(this.cookieName);
	if (chunks == null || chunks.length == 0 || chunks == '[]') {
		chunks = [];
	} else {
		chunks = $.evalJSON(chunks);
	}

	// validate the 'q' parameter
	var queryString = new BuildUrl(window.location.search),
		pattern = /([\w_\/]+)(::?)\(([^\)]*)\)/,
		q = '';
	for (var i = 0; i < chunks.length; i++) {
		var matches = pattern.exec(chunks[i].refine || chunks[i].query);
		if (matches != null) {
			if (matches[1] == 'categories') {
				// do not handle the refines
			} else if (matches[1] == 'text') {
				q += ' ' + matches[3];
			} else {
				q += ' ' + (chunks[i].refine || chunks[i].query);
			}
		}
	}

	// retrieve the current query
	var curQuery = queryString.getParameter(this.queryVar);
	if (curQuery != null) {
		curQuery = curQuery[0];
	}

	if (curQuery != null && curQuery != $.trim(q)) {
		// create new chunks for the current queryString
		return [{
			attr: 'text',
			query: 'text:(' + curQuery + ')',
			rowType: 'fulltext',
			value: curQuery
		}];
	}

	// returns the completed chunks
	for (var i = 0; i < chunks.length; i++) {
		if (chunks[i].parent != undefined) {
			for (var j = 0; j < chunks.length; j++) {
				if (chunks[j].rowType == 'type' && chunks[j].type == chunks[i].parent) {
					chunks[i].parent = chunks[j];
					break;
				}
			}
		}
	}
	return chunks;
};

TrustedQuery.prototype.adjustPosition = function() {
	if (this.visible == false) {
		return;
	}

	var sfwSize = {x: this.$sfw.outerWidth(), y: this.$sfw.outerHeight()};
	var swfOffest = this.$sfw.offset();

	this.$topWrapper.css({
		width: (Math.ceil(sfwSize.x) - 4) + 'px', /* -4 for padding & border */
		left: Math.ceil(swfOffest.left) + 'px',
		top: Math.ceil(swfOffest.top + sfwSize.y) + 'px'
	});

	/* IE loose focus after resize */
	if ($.browser.msie) {
		this.$input.focus();
	}
};

/**
 * Callback of the ajax calls: Create the whole suggestion box out of
 * JSON data.
 */
TrustedQuery.prototype.loadJSON = function(tqanswer) {
	this.$tbl.empty();
	this.suggestions = [];

	if (tqanswer != null && tqanswer.error != null) {
		this.$tbl.append('' +
				'<tr class="suggestion">' +
					'<td class="error">' +
						tqanswer.error +
					'</td>' +
				'</tr>'
			);
			this.displaySuggestions(true);
			return;
	} else if (this.hasResults(tqanswer) == false) {
		this.displaySuggestions(false);
		return;
	}

	var typesLength = tqanswer.types.length;
	for (var i = 0; i < typesLength; i++) {
		var typeObj = tqanswer.types[i],
			typeObjLight = { display: typeObj.display, refine: typeObj.refine, type: typeObj.type, attr: '', rowType: 'type' };

		var totalRows = 1;
		var attrLength = typeObj.attributes.length;
		for (var j = 0; j < attrLength; j++) {
			totalRows += typeObj.attributes[j].values.length + (typeObj.attributes[j].hasMoreValues ? 1 : 0);
		}

		if (!this.forceType) {
			this.createSuggestionRow('type', typeObjLight, null, typeObjLight, { nbRows: totalRows });
		}

		for (var j = 0; j < attrLength; j++) {
			var attrObj = typeObj.attributes[j];
			var valuesLength = attrObj.values.length, hasMoreValues = attrObj.hasMoreValues;
			var loopStatus = { nbRows: (valuesLength + (hasMoreValues ? 1 : 0)), valueFirst: true, typeLast: (i == (typesLength - 1)), attrLast: (j == (attrLength - 1)) };
			for (var k = 0; k < valuesLength; k++) {
				loopStatus.valueFirst = k == 0;
				loopStatus.valueLast = k == (loopStatus.nbRows - 1);
				this.createSuggestionRow('value', typeObjLight, attrObj, attrObj.values[k], loopStatus);
			}
			if (hasMoreValues == true) {
				loopStatus.valueFirst = false;
				loopStatus.valueLast = true;
				this.createSuggestionRow('field', typeObjLight, attrObj, { display : '...', field : attrObj.field }, loopStatus);
			}
		}
	}

	this.displaySuggestions(true);
};


TrustedQuery.prototype.hasResults = function(tqanswer) {
	if (tqanswer != null && tqanswer.types != null) {
		var typesLength = tqanswer.types.length;
		for (var i = 0; i < typesLength; i++) {
			var type = tqanswer.types[i], attrLength = type.attributes.length;
			if (attrLength == 0) {
				return true;
			} else {
				for (var j = 0; j < attrLength; j++) {
					var attr = type.attributes[j], valueLength = attr.values.length;
					if (valueLength > 0 || attr.hasMoreValues == true) {
						return true;
					}
				}
			}
		}
	}
	return false;
};

TrustedQuery.prototype.createSuggestionRow = function(rowType, typeObj, attrObj, valueObj, loopStatus) {
	var trInfos = $.extend({}, valueObj, {
		rowType: rowType,
		parent: rowType == 'type' ? null : typeObj,
		attr: attrObj == null ? '' : attrObj.attribute.replace(/_/g, ' ')
	});

	var $tr;

	// suggest type

	if (rowType == 'type') {
		$tr = $('' +
			'<tr class="type ' + typeObj.type + '">' +
				'<td class="background"></td>' +
				'<td class="value color"><span class="icon"></span> ' + trInfos.display + '</td>' +
			'</tr>');

		if (loopStatus.nbRows > 1) {
			$tr.find('.value').attr('colspan', '2');
			$tr.find('.background').attr('rowspan', loopStatus.nbRows);
		} else {
			$tr.find('.value').addClass('suggestion');
		}

	// suggest prefix: no value nor count
	} else if (attrObj.hasMoreValues == true && attrObj.values.length == 0) {
		$tr = $('' +
				'<tr class="prefix">' +
					'<td class="attr border"><span class="arrow"></span> ' + attrObj.display + '</td>' +
					'<td class="value border suggestion">...</td>' +
				'</tr>'
			);

		if (loopStatus.typeLast) {
			$tr.find('.attr,.value').removeClass('border');
		}

	// suggest value
	} else {

		$tr = $('' +
			'<tr class="value">' +
				'<td class="attr border" rowspan="' + loopStatus.nbRows + '"><span class="arrow"></span> ' + attrObj.display + '</td>' +
				'<td class="value border suggestion">' + trInfos.display + ' <span class="count">(' + trInfos.count + ')</span></td>' +
			'</tr>'
		);

		if (trInfos.display == '...') {
			if (this.state.field != null) {
				$tr.find('.value').addClass('more').removeClass('suggestion').html('Start typing to get more suggestions');
			} else {
				$tr.find('.value').addClass('more').html('Show more values...');
			}
		}

		if (loopStatus.valueFirst == false) {
			$tr.find('.attr').remove();
		}
		if (trInfos.count == null) {
			$tr.find('.count').remove();
		}

		if (!loopStatus.valueLast || (loopStatus.valueLast && loopStatus.attrLast && loopStatus.typeLast)) {
			$tr.find('.value').removeClass('border');
		}
		if (loopStatus.valueFirst && loopStatus.attrLast && loopStatus.typeLast) {
			$tr.find('.attr').removeClass('border');
		}
	}

	if (rowType != 'type' || loopStatus.nbRows <= 1) {
		this.suggestions.push($tr[0]);
	}

	$tr.data('infos', trInfos);

	var _this = this;
	if ($tr.find('.suggestion').length > 0) {
		$tr.bind({
			mouseover: function() { _this.select(_this.suggestions.indexOf(this)); },
			mouseout: function() { _this.select(-1); },
			click: function() { _this.validate($(this).data('infos')); return false; }
		});
	} else {
		$tr.bind({
			mouseover: function() { _this.select(-1); },
			click: function() { return false; }
		});
	}

	$tr.appendTo(this.$tbl);
};

/**
 * Make the AJAX call to the trusted query engine.
 */
TrustedQuery.prototype.callSuggest = function() {
	this.$query.val(this.createIndexQuery());

	if (this.request != null) {
		this.request.abort();
	}

	var _this = this;

	this.$spinner.show();
	this.request = $.ajax({url: this.url, dataType: 'json', data: this.$form.serialize() + '&wuid=' + this.wuid,
		success: function(result) { _this.loadJSON(result); },
		complete: function() { _this.$spinner.hide(); _this.request = null; }
	});
};

/**
 * The actual onclick / onkey == enter event on a suggestion
 */
TrustedQuery.prototype.suggestEvent = function(e) {
	var _this = e.data._this;

	/* clear previous ajax call */
	if (_this.timer != null) {
		clearTimeout(_this.timer);
		_this.timer = null;
	}

	var submit = false,
		cancelEvent = false;

	/* retrieve vars */
	var value = $.trim(_this.$input.val()),
		valueLength = value.length,
		keyCode = e.keyCode,
		keys = _this.keys;

	switch (keyCode) {

	/* delete the currently focused chunk */
	case keys.SUPPR:
		if (valueLength == 0) {
			if (_this.hasFocusChunk()) {
				_this.removeFocusChunk();
			}
		}
		submit = true;
		break;

	/* should either select previous chunk or delete if focused / opened field */
	case keys.BACKSPACE:
		if (valueLength == 0) {
			if (_this.hasFieldChunk()) {
				_this.removeFieldChunk();
			} else if (_this.hasFocusChunk()) {
				_this.removeFocusChunk();
			} else if (_this.state.chunks.length > 0) {
				var chunk = _this.state.chunks[_this.state.chunks.length - 1];
				if (chunk.type === true) {
					_this.removeQueryChunk(_this.state.chunks.length - 1);
				} else {
					_this.setFocusChunk(chunk);
				}
			}
		}
		submit = true;
		break;

	/* navigate through suggestions */
	case keys.UP:
	case keys.DOWN:

		if (_this.visible == true) {
			if (_this.suggestions.length > 0) {
				var toSelect = _this.selected + (e.keyCode == keys.UP ? -1 : 1);
				if (toSelect == _this.suggestions.length) {
					toSelect = 0;
				} else if (toSelect < 0) {
					toSelect = _this.suggestions.length - 1;
				}
				_this.select(toSelect);
				cancelEvent = true;
			}
		}
		break;

	/* validate a suggestion */
	case keys.ENTER:

		if (_this.selected != -1) {
			$(_this.suggestions[_this.selected]).click();
		} else if (valueLength > 0) {
			/* we have something in the input, lets fulltext */
			var infos = _this.createFulltextInfos();
			if (infos != false) {
				_this.validate(infos);
			}
		} else  {
			_this.submitForm();
		}

		cancelEvent = true;
		break;

	/*  clicked on a suggestion or input */
	case keys.CLICKED:

		_this.setFocusChunk(null);
		if (_this.visible == false || valueLength == 0) {
			submit = true;
		} else if (_this.selected != -1) {
			$(_this.suggestions[_this.selected]).click();
		}
		break;

	/* close suggestion tab*/
	case keys.ESC:

		_this.displaySuggestions(false);
		cancelEvent = true;
		break;

	case keys.RIGHT:
	case keys.LEFT:
		break;

	/* by default we trigger a new suggestion */
	default:
		submit = true;
	}

	if (submit == true) {
		_this.selected = -1;
		_this.timer = setTimeout(function() { _this.callSuggest(); }, 300);
	}
	return !cancelEvent;
};

/**
 * On mouse over event to highlight a suggestion
 */
TrustedQuery.prototype.select = function(toSelect) {
	if (this.selected != -1) {
		$(this.suggestions[this.selected]).removeClass('selected');
	}
	if (toSelect != -1) {
		$(this.suggestions[toSelect]).addClass('selected');
	}
	this.selected = toSelect;
};

/**
 * Show/Hide the suggestions
 */
TrustedQuery.prototype.displaySuggestions = function(show) {
	this.visible = show;
	if (show === true) {
		this.adjustPosition(); // adjust position before displaying it
		this.$topWrapper.show();
	} else {
		this.$topWrapper.hide();
	}
};

/**
 * Called by the onclick / onkey == enter enter method to validate a suggestion. Takes care of firing the ajax call,
 * reset the selected pointer, add the query chunk and hide the suggest box.
 */
TrustedQuery.prototype.validate = function(infos) {
	this.selected = -1;

	this.filterInput(infos);
	this.addQueryChunk(infos, true);

	this.$topWrapper.hide();
	this.callSuggest();
};

/**
 * When a suggestion is chosen, we add it to the internal query state chunks.
 * Depending on the type we might want to switch into field search state etc...
 * This method also calls the create widget stuff.
 * 
 * canSubmit prevent submitting when reconstructing the query on page load
 */
TrustedQuery.prototype.addQueryChunk = function(infos, canSubmit) {
	/* automatically add the chunk's class to the query if none selected */
	if (!this.forceType) {
		if (this.state.type == undefined) {
			if (infos.rowType == 'type') {
				this.state.type = infos.type;
				this.state.chunks.unshift({query: infos.refine, widget: this.createWidget(infos), type: true, infos: infos});
			} else if (infos.parent) {
				this.state.type = infos.parent.type;
				this.state.chunks.unshift({query: infos.parent.refine, widget: this.createWidget(infos.parent), type: true, infos: infos.parent});
			}
		}
	}

	/* remove any opened or focused field */
	this.removeFieldChunk();
	this.setFocusChunk(null);

	/* add the new chunk */
	switch (infos.rowType) {
	case 'value':
		this.state.chunks.push({query: infos.refine, infos: infos, widget: this.createWidget(infos)});
		if (infos.count === 1 && canSubmit === true) {
			this.submitForm();
		}
		break;
	case 'field':
		this.state.field = {field: infos.field, infos: infos, widget: this.createWidget(infos)};
		break;
	case 'fulltext':
		this.state.chunks.push({query: infos.query, infos: infos, widget: this.createWidget(infos)});
		break;
	}

	this.$input.focus();
};

/**
 * Create a widget out of a suggestion regarding it's type.
 */
TrustedQuery.prototype.createWidget = function(infos) {
	var $wgt = $('' +
		'<div class="qwidget">' +
			'<div>' +
				'<span class="attr"></span><span class="input"></span>' +
			'</div>' +
		'</div>'
	);

	if (infos.rowType == 'type') {

		$wgt.find('div').addClass('type ' + infos.type);
		$wgt.find('.attr').removeClass('attr').addClass('icon');
		$wgt.find('.input').html(infos.display.escapeHTML());
		$wgt.prependTo(this.$input.parent().parent());

	} else if (infos.rowType == 'value' || infos.rowType == 'fulltext') {

		$wgt.find('div').addClass('value');
		$wgt.find('.attr').html(infos.attr + ':');
		$wgt.find('.input').html(infos.value.escapeHTML());
		$wgt.insertBefore(this.$input.parent());

	} else if (infos.rowType == 'field') {

		$wgt.find('div').addClass('field');
		$wgt.find('.attr').html(infos.attr.escapeHTML() + ':');
		$wgt.find('.input').remove();
		$wgt.insertBefore(this.$input.parent());
	}

	$wgt.bind('click', { _this: this, $widget: $wgt }, function(e) {
		var _this = e.data._this, $wgt = e.data.$widget;

		_this.removeFieldChunk();

		var idx = $wgt.parent().find('> .qwidget').index($wgt);
		if ((chunk = _this.state.chunks[idx]) != null && chunk.infos != undefined && chunk.infos.rowType != 'type') {
			_this.setFocusChunk(chunk);
		}
	});

	return $wgt[0];
};

/**
 * Removes a chunk
 */
TrustedQuery.prototype.removeQueryChunk = function(index) {
	if (index >= 0 && index < this.state.chunks.length) {
		var chunk = this.state.chunks.splice(index, 1);
		$(chunk[0].widget).remove();
		if (chunk[0].type === true) {
			delete this.state.type;
		}
		if (this.state.focused != undefined && this.state.focused == chunk[0]) {
			delete this.state.focused;
		}
		this.$input.focus();
	}
};

/**
 * Returns whether a field chunk exists or not
 */
TrustedQuery.prototype.hasFieldChunk = function() {
	return this.state.field != undefined;
};

/**
 * Removes a FIELD chunk
 */
TrustedQuery.prototype.removeFieldChunk = function() {
	if (this.hasFieldChunk()) {
		$(this.state.field.widget).remove();
		delete this.state.field;
		this.$input.focus();
		return true;
	}
	return false;
};

/**
 * Sets a chunk as focused
 */
TrustedQuery.prototype.setFocusChunk = function(chunk) {
	if (chunk == null) {
		if (this.state.focused != undefined) {
			$(this.state.focused.widget).removeClass('focused');
			delete this.state.focused;
		}
	} else {
		this.state.focused = chunk;
		this.$wtr.find('.qwidget').removeClass('focused');
		$(chunk.widget).addClass('focused');
		this.$input.focus();
	}
};

/**
 * Returns whether a chunk is focused
 */
TrustedQuery.prototype.hasFocusChunk = function() {
	return this.state.focused != undefined;
};

/**
 * Removes a FOCUSED chunk
 */
TrustedQuery.prototype.removeFocusChunk = function() {
	if (this.hasFocusChunk()) {
		this.removeQueryChunk(this.state.chunks.indexOf(this.state.focused));
		return true;
	}
	return false;
};

/**
 * Called when a suggestion have been chosen to filter out the current full text.
 * Example: I typed: "contacts ibm", selected "All contacts", we test all words of the suggestion
 * (all and contacts) against the input to remove words that match, so we'll keep ibm.
 */
TrustedQuery.prototype.filterInput = function(infos) {
	if (infos.rowType == 'fulltext') {
		this.$input.val('');
	} else {
		var ldisp = '';
		if (this.state.type == undefined) {
			ldisp += ' ' + (infos.parent ? infos.parent.type : infos.type);
		}
		if (infos.attr != null) {
			ldisp += ' ' + infos.attr;
		}
		if (infos.rowType != 'field') {
			ldisp += ' ' + infos.display.toLowerCase();
		}

		var words = $.trim(this.$input.val()).split(' ');
		var keep = [];
		for (var i = 0, length = words.length; i < length; ++i) {
			if (ldisp.indexOf(words[i]) == -1) {
				keep.push(words[i]);
			}
		}
		this.$input.val(keep.join(' '));
	}
};

/**
 * Create the index query to be sent to the product.
 */
TrustedQuery.prototype.createIndexQuery = function() {
	var q  = '';

	var chunks = this.state.chunks,
		chunksLength = chunks.length;
	for (var i = 0; i < chunksLength; i++) {
		q += ' ' + chunks[i].query;
	}

	var value = $.trim(this.$input.val());
	if (this.state.field != undefined) {
		q += ' ' + this.state.field.field + this.OPENED_FIELD_SEPARATOR + '(' + value + ')';
	} else if (value.length > 0) {
		q += ' ' + 'search:(' + value + ')';
	}

	return $.trim(q);
};

/**
 * Submit the search for real (not ajax).
 */
TrustedQuery.prototype.submitForm = function() {

	/* remove any opened field */
	this.removeFieldChunk();

	var chunks = this.state.chunks,
		chunksLength = chunks.length,
		pattern = /([\w_\/]+)(::?)\(([^\)]*)\)/,
		q = '';

	/* handle the current freetext */
	var value = $.trim(this.$input.val());
	if (value.length > 0) {
		q = value;
	}

	/* handle the chunks */
	for (var i = 0; i < chunksLength; i++) {
		var matches = pattern.exec(chunks[i].query);
		if (matches != null) {
			if (matches[1] == 'categories') {
				for (var j = 0; j < this.refines.length; j++) {
					this.$form.append('<input type="hidden" name="' + this.refines[j] + '.r" value="' + matches[3] + '" />');
				}
			} else if (matches[1] == 'text') {
				q += ' ' + matches[3];
			} else {
				q += ' ' + chunks[i].query;
			}
		}
	}

	this.$query.val($.trim(q));

	/* save the current query chunks */
	var cookieChunks = [];
	for (var i = 0; i < chunksLength; i++) {
		if (chunks[i].infos) {
			// do not save the WHOLE parent but only its type
			if (chunks[i].infos.parent != undefined) {
				chunks[i].infos.parent = chunks[i].infos.parent.type;
			}
			cookieChunks.push(chunks[i].infos);
		}
	}
	$.cookie(this.cookieName, $.toJSON(cookieChunks));

	/* trigger the form submit */
	this.$form.trigger('submit');
	this.$form.submit();
};

/**
 * Create a valid chunk's infos for "Fulltext" type
 */
TrustedQuery.prototype.createFulltextInfos = function() {
	var value = $.trim(this.$input.val());

	/* freetext */
	if (this.state.field == undefined) {
		return {
			rowType: 'fulltext',
			query: 'text:(' + value + ')',
			value: value,
			attr: 'text'
		};

	/* try to match a suggested value */
	} else {
		var valueNormalized = value.toLowerCase();
		var suggestionsCount = this.suggestions.length;
		for (var i = 0; i < suggestionsCount; i++) {
			var data = $(this.suggestions[i]).data('infos');
			if ((suggestionsCount == 1 && data.value != '...') || (data.value != undefined && data.value.toLowerCase() == valueNormalized)) {
				return data;
			}
		}
	}

	/* invalid user input, ignore */
	return false;
};

/**
 * Attaches an auto grow event to the given input
 * 
 * @param $input
 */
TrustedQuery.prototype.attachAutoGrowEvent = function($input) {
    var minWidth = $input.width();
    var val = '';
    var o = {
        maxWidth: this.$sfw.width(),
        comfortZone: 30
    };

    var $testSubject = $('<tester/>').css({
        position: 'absolute',
        top: -9999,
        left: -9999,
        width: 'auto',
        fontSize: $input.css('fontSize'),
        fontFamily: $input.css('fontFamily'),
        fontWeight: $input.css('fontWeight'),
        letterSpacing: $input.css('letterSpacing'),
        whiteSpace: 'nowrap'
    });

    var check = function() {
        if (val === (val = $input.val())) {return;}

        // Enter new content into testSubject
        var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        $testSubject.html(escaped);

        // Calculate new width + whether to change
        var testerWidth = $testSubject.width(),
            newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
            currentWidth = $input.width(),
            isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                                 || (newWidth > minWidth && newWidth < o.maxWidth);

        // Animate width
        if (isValidWidthChange) {
            $input.width(newWidth);
        }
    };

    $testSubject.insertAfter($input);
    $input.on('keyup keydown blur update', check);
    check();
};