/* Copied from Search-UI, Thanks to Nigel MOTTE :) */
(function($) {
	$.fn.enableSuggest = function(url, pageName, wuid, options) {
		options = $.extend({
			format: 'default',
			queryParameter: 'value',
			suggestBoxClass: 'mashup-suggest-container',
			itemHighlightedClass: 'highlighted',
			autoSubmit: true,
			delay: 0
		}, options);

		var buildSuggestBox = function(suggestContext) {
			var offset = suggestContext.$input.offset();
			var width = suggestContext.$input.innerWidth();
			suggestContext.$suggestBox = $('<div class="' + options.suggestBoxClass.escapeHTML() + '" style="display:none;"><ul></ul></div>');
			suggestContext.$suggestBox.width(width < 300 ? 300 : width);
			suggestContext.$suggestBox.appendTo($('body'));
		};

		var getSuggestions = function(suggestContext, onSuccessCallback) {
			var thisRequest = ++suggestContext.suggestRequests;

			if (suggestContext.$input.val() == "") {
				suggestContext.suggestUpdate = thisRequest;
				suggestContext.suggestions = [];
				onSuccessCallback(suggestContext);
				return;
			}

			var parameters = {};
			parameters["wuid"] = wuid;
			parameters["inputName"] = suggestContext.$input.attr('name');
			parameters["cursor"] = getCaretPosition(suggestContext.$input[0]);
			parameters["exhaustive"] = true;
			parameters[options.queryParameter] = suggestContext.$input.val();

			$.ajax({
				url: url,
				dataType: 'json',
				data: parameters,
				success: function(data) {
					/* update only with suggestions newer than the ones displayed */
					if (thisRequest < suggestContext.suggestUpdate) {
						return;
					}
					suggestContext.suggestUpdate = thisRequest;
					suggestContext.suggestions = suggestContext.extractSuggestions(data);
					onSuccessCallback(suggestContext);
				},
				error: function(xhr, textStatus) {
					if (thisRequest < suggestContext.suggestUpdate) {
						return;
					}
					suggestContext.suggestUpdate = thisRequest;
				}
			});
		};

		var extractSuggestionsFromDefault = function(data) {
			return data;
		};

		var extractSuggestionsFromGoogleFormat = function(data) {
			var suggestions = { entries: [] };
			for (var i = 0; i < data[1].length; ++i) {
				suggestions.entries.push({ entry: data[1][i][0], matchOffset: 0, matchLength: 0 });
			}
			return suggestions;
		};

		var renderSuggestions = function(suggestions, inputValue) {
			var suggestionsItems = '';
			var regx = null;
			if (suggestions.entries != undefined) {
				for (var i = 0; i < suggestions.entries.length; i++) {
					var entry = suggestions.entries[i], value = entry.entry;
					var display;
					if (entry.matchOffset != undefined && entry.matchLength != undefined) {
						display = value.substr(0, entry.matchOffset) + '<span class="matched">' + value.substr(entry.matchOffset, entry.matchLength) + '</span>' + value.substr(entry.matchOffset + entry.matchLength);
					} else {
						if (regx == null) {
							regx = new RegExp('(' + inputValue + ')', 'gi');
						}
						display =  value.replace(regx, '<span class="matched">$1</span>');
					}
					suggestionsItems += '<li data-value="' + value.escapeHTML() + '">' + display + '</li>';
				}
			}
			return suggestionsItems;
		};

		var displaySuggestions = function(suggestContext) {
			if (options.delay == 0) {
				getSuggestions(suggestContext, updateSuggestions);
			} else if (!suggestContext.inDelay) {
				suggestContext.inDelay = true;
				window.setTimeout(function() {
					suggestContext.inDelay = false;
					return getSuggestions.call(this, suggestContext, updateSuggestions);
				}, options.delay);
			}
		};

		var updateSuggestions = function(suggestContext) {
			if (suggestContext.suggestions == undefined || suggestContext.suggestions.entries == undefined || suggestContext.suggestions.entries.length == 0) {
				suggestContext.$suggestBox.hide();
			} else {
				var offset = suggestContext.$input.offset();
				suggestContext.$suggestBox.css('left', offset.left);
				suggestContext.$suggestBox.css('top', offset.top + suggestContext.$input.outerHeight() - 1);

				suggestContext.$suggestBox.show();
				var ulElt = suggestContext.$suggestBox.find("ul");
				ulElt.html(renderSuggestions(suggestContext.suggestions, suggestContext.$input.val()));
				configureSuggestionItems(suggestContext.$input, ulElt);
			}
		};

		var getCaretPosition = function(field) {
			var cursor = 0;
			if (document.selection) {
				field.focus();
				var oSel = document.selection.createRange();
				oSel.moveStart('character', -field.value.length);
				cursor = oSel.text.length;
			} else if (field.selectionStart || field.selectionStart == '0') {
				cursor = field.selectionStart;
			}
			return cursor;
		};

		var configureSuggestionItems = function($input, ulElt) {
			ulElt.find("li").each(function() {
				$(this).bind("click", $input, onSuggestItemClicked);
				$(this).bind("mouseenter", this, onMouseEnterSuggestItem);
				$(this).bind("mouseleave", this, onMouseLeaveSuggestItem);
			});
		};

		var onSuggestItemClicked = function(event) {
			var $input = event.data;
			setInputFromLi($input, this);
			if (options.autoSubmit == true) {
				$input.closest("form").submit();
			}
		};

		var onMouseEnterSuggestItem = function(event) {
			$(this).parent().find('li.'+options.itemHighlightedClass).removeClass(options.itemHighlightedClass);
			$(this).addClass(options.itemHighlightedClass);
		};

		var onMouseLeaveSuggestItem = function(event) {
			$(this).removeClass(options.itemHighlightedClass);
		};

		var selectNextSuggestion = function($input) {
			var getNextWhenNoSelection = function(list) {
				return list.get(0);
			};
			var getNext = $.fn.next;
			_selectSuggestion($input, getNextWhenNoSelection, getNext);
		};

		var selectPreviousSuggestion = function($input) {
			var getNextWhenNoSelection = function(list) {
				return list.get(list.length - 1);
			};
			var getNext = $.fn.prev;
			_selectSuggestion($input, getNextWhenNoSelection, getNext);
		};

		var _selectSuggestion = function(suggestContext, getNextWhenNoSelection, getNext) {

			var suggestions = suggestContext.$suggestBox.find("li");
			if (suggestions.length == 0) {
				return;
			}
			if (suggestContext.$suggestBox.is(":hidden")) {
				suggestContext.$suggestBox.show();
				return;
			}
			var selectedSuggestion = suggestions.filter("." + options.itemHighlightedClass);
			if (selectedSuggestion.length == 1) {
				var nextSugg = getNext.call(selectedSuggestion);
				selectedSuggestion.removeClass(options.itemHighlightedClass);
				if (nextSugg.get(0) != undefined) {
					setInputFromLi(suggestContext.$input, nextSugg.get(0));
					nextSugg.addClass(options.itemHighlightedClass);
				} else {
					suggestContext.$input.val(suggestContext.previousInputValue);
				}
			} else {
				var nextSugg = getNextWhenNoSelection(suggestions);
				$(nextSugg).addClass(options.itemHighlightedClass);
				setInputFromLi(suggestContext.$input, nextSugg);
			}
		};

		var setInputFromLi = function($input, li) {
			$input.val($(li).attr('data-value').unescapeHTML());
		};

		var onKeyUp = function(event) {
			var suggestContext = event.data;

			if (suggestContext.disabled) {
				return;
			}

			var code = event.which;
			if (code == 27 || code == 38 || code == 40) {
				return;
			}

			if (suggestContext.previousInputValue && this.value == suggestContext.previousInputValue) {
				return;
			}
			suggestContext.previousInputValue = this.value;
			displaySuggestions(suggestContext);
		};

		var onKeyDown = function(event) {
			var suggestContext = event.data;

			if (suggestContext.disabled) {
				return;
			}

			switch (event.which) {
			/* ESC */
			case 27:
				suggestContext.$suggestBox.hide();
				return false;
			/* UP */
			case 38:
				selectPreviousSuggestion(suggestContext);
				return false;
			/* DOWN */
			case 40:
				selectNextSuggestion(suggestContext);
				return false;
			}
		};

		var onBlur = function(event) {
			var suggestContext = event.data;
			setTimeout(function() {
				suggestContext.$suggestBox.hide();
			}, 400);
		};

		return this.map(function() {

			if (this.nodeType != 1 || this.tagName != "INPUT" || this.type != "text") {
				return;
			}

			var suggestContext = {
				options : options,
				$input : $(this),
				previousInputValue : null,
				$suggestBox : null,
				suggestRequests : 0,
				suggestUpdate : 0,
				suggestions : [],
				inDelay : false,
				extractSuggestions : null,
				disabled : false
			};

			switch (options.format) {
			case "google":
				suggestContext.extractSuggestions = extractSuggestionsFromGoogleFormat;
				break;
			default:
				suggestContext.extractSuggestions = extractSuggestionsFromDefault;
				break;
			}

			buildSuggestBox(suggestContext);

			$(this).attr('autocomplete', 'off');
			$(this).bind('keyup', suggestContext, onKeyUp);
			$(this).bind('keydown', suggestContext, onKeyDown);
			$(this).bind('blur', suggestContext, onBlur);

			return {
				off : function() {
					suggestContext.$suggestBox.hide();
					suggestContext.disabled = true;
				},
				on : function() {
					suggestContext.disabled = false;
				}
			};
		});
	};
})(jQuery);
