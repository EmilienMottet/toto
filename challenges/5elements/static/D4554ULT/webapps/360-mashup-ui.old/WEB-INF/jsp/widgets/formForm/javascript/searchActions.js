jQuery.fn.searchForm = function(options) {
	function init($spanEl) {
		var $searchForm = $spanEl.closest('form');

		/* switch selected status */
		$searchForm.find('.actions span.selected').removeClass('selected');
		$spanEl.addClass('selected');

		/* Clear previous auto appended params */
		$searchForm.find('input.hiddenParam').remove();

		/* append parameters according to searchForm options */
		var url = new BuildUrl($spanEl.attr('data-action') || $spanEl.attr('action'));
		var parameters = url.getParameters();
		for (var name in parameters) {
			if (parameters.hasOwnProperty(name)) {
				for (var j = 0; j < parameters[name].length; j++) {
					$searchForm.append('<input class="hiddenParam" type="hidden" name="'+name+'" value="'+parameters[name][j]+'" />');
				}
			}
		}

		/* update form's action */
		$searchForm.attr('action', url.getPath());

		/* auto focus of the first input */
		var $ipt = $searchForm.find('.searchInput:first');
		if (options.focus) {
			$ipt.focus();
		}

		return $ipt;
	}

	var selected = null;
	var $searchForm = $(this);
	var $spanActions = $searchForm.find('.actions span');
	var geoInterfaces = [];
	if ($spanActions.length > 0) {

		var hurl = new BuildUrl(window.location.pathname + window.location.search);
		var nbParams = -1;

		$spanActions.each(function() {
			var $this = $(this);
			$this.bind('click', function(e) {
				init($(this));
				return false;
			});

			var aurl = new BuildUrl($this.attr('data-action'));
			var good = aurl.getPage() == '' || hurl.getPage() == aurl.getPage();

			var newNbParams = 0;
			var parameters = aurl.getParameters();
			for (var name in parameters) {
				if (parameters.hasOwnProperty(name)) {
					var avalues = parameters[name];
					var hvalues = hurl.getParameter(name);
					if (hvalues != undefined) {
						for (var i = 0; i < avalues.length; i++) {
							good = good && (hvalues.indexOf(avalues[i]) != -1);
							newNbParams++;
						}
					}
				}
			}

			if (good == true && newNbParams > nbParams) {
				selected = $this;
				nbParams = newNbParams;
			}
		});

		selected = selected || $searchForm.find('.actions span:first');
	} else {
		selected = $searchForm;
	}

	/*
	 * Init form actions and hidden parameters
	 */

	init(selected);

	/*
	 * Handle geolocation
	 */

	if (options.geolocation && options.geolocation.enable && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				$searchForm.append('<input type="hidden" name="'+options.geolocation.latitude+'" value="'+position.coords.latitude+'" />');
				$searchForm.append('<input type="hidden" name="'+options.geolocation.longitude+'" value="'+position.coords.longitude+'" />');
				for (var i = 0; i < geoInterfaces.length; i ++) {
					geoInterfaces[i].addMarker({
						location:position.coords.latitude+','+position.coords.longitude,
						iconUrl: mashup.baseUrl + "/resources/widgets/formForm/images/icon_localisation.png",
						anchorX:10,
						anchorY:10,
						width:20,
						height:20
					});
				}
			}, null, options.geolocation.options);
	}

	/*
	 * Handle search's options
	 */

	if (options.keepRefinements) {
		var state = $.evalJSON($.cookie('state_' + options.uid) || '{}');
		var $optionsContainer = $searchForm.find('.options');

		if (state.keepRefinements == undefined && options.keepRefinementsState) {
			state.keepRefinements = options.keepRefinementsState;
		}

		if (state.keepRefinements == true) {
			$optionsContainer.find('input[data-name=keepRefinements]').attr('checked', 'checked');
		}

		$optionsContainer.find('input[type=checkbox]').bind('change', function(e) {
			state[$(this).attr('data-name')] = $(this).is(':checked');
		});

		$searchForm.bind('submit', function(e) {
			/* save search form state */
			$.cookie('state_' + options.uid, $.toJSON(state));

			/* handle search form options */
			if (state.keepRefinements == true) {
				var whitelist = ['.context', '.r', '.cr', '.zr'];
				var url = new BuildUrl(window.location.pathname + window.location.search);
				var parameters = url.getParameters();
				for (var name in parameters) {
					if (parameters.hasOwnProperty(name)) {
						for (var i = 0; i < whitelist.length; i++) {
							if (name.slice(-whitelist[i].length) == whitelist[i]) {
								for (var j = 0; j < parameters[name].length; j++) {
									$searchForm.append('<input class="hiddenParam" type="hidden" name="'+name+'" value="'+decodeURIComponent(parameters[name][j])+'" />');
								}
							}
						}
					}
				}
			}
		});
	}

	/*
	 * Handle GeoInterface
	 */
	function registerGeoInteface(wuid, parameter, value, meta) {
		var $geoFormInput = null;
		if (parameter && meta) {
			$geoFormInput = $('<input type="hidden" name="'+parameter+'" value="'+value+'" />');
			$searchForm.append($geoFormInput);
		}
		exa.io.register('exa.io.GeoInterface', wuid, function (geoInterface) {
			if (parameter && meta) {
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
			}
			geoInterfaces.push(geoInterface);
		});
 	}

	if (options.geoForm && options.geoForm.length > 0) {
		for (var i = 0; i < options.geoForm.length; i ++) {
			registerGeoInteface(options.geoForm[i].wuid, options.geoForm[i].parameter, options.geoForm[i].value, options.geoForm[i].geoMetaName);
		}
	}

	var interfaceExtraParameters = {},
		interfaceListeners = [],
		interfaceImpl = {
			addParameter: function (name, value, override) {
				if (typeof interfaceExtraParameters[name] == 'undefined') {
					interfaceExtraParameters[name] = [];
				}
				if (override) {
					interfaceExtraParameters[name].length = 0;
				}
				interfaceExtraParameters[name].push(value);
			},
			removeParameter: function (name) {
				delete interfaceExtraParameters[name];
			},
			getParameter: function (name) {
				if (typeof interfaceExtraParameters[name] != 'undefined') {
					return interfaceExtraParameters[name][0];
				}
			},
			getParameterValues: function (name) {
				return interfaceExtraParameters[name];
			},
			addOnSubmitListener : function (listener) {
				interfaceListeners.push(listener);
			}
		};

	exa.io.share('exa.io.FormInterface', options.uid, interfaceImpl);

	$searchForm.bind('submit', function(e) {
		for (var i = 0; i < interfaceListeners.length; i ++) {
			interfaceListeners[i](interfaceImpl);
		}
		for (var name in interfaceExtraParameters) {
			if (interfaceExtraParameters.hasOwnProperty(name)) {
				for (i = 0; i < interfaceExtraParameters[name].length; i ++) {
					$searchForm.append('<input class="hiddenParam" type="hidden" name="'+name+'" value="'+decodeURIComponent(interfaceExtraParameters[name][i])+'" />');
				}
			}
		}
	});


};
(function($){
	$.fn.instantSearch = function(options) {
		var mashupAjaxClient = null;
		options = $.extend({
			wuids: [],
			expandQueryAfter: null,
			parameter: 'q',
			success: function() {}
		}, options);

		var delayCallback = (function() {
			var timer = 0;
			return function(callback, ms){
				clearTimeout(timer);
				timer = setTimeout(callback, ms);
			};
		})();

		$(this).find('.searchInput:first').keyup(function() {
			var value = $.trim($(this).val());
			if ((value == this.previousVal && this.previousVal != null)) {
				return;
			}
			this.previousVal = value;

			delayCallback(function() {
				var query = value;
				var lastQueryWord = (query.lastIndexOf(' ') != -1) ? query.substr(query.lastIndexOf(' ') + 1) : query;
				if (options.expandQueryAfter && lastQueryWord.length > options.expandQueryAfter) {
					query += ' MAX ' + lastQueryWord + '*{w/=10}';
				}

				if (mashupAjaxClient != null) {
					mashupAjaxClient.remove();
				}

				mashupAjaxClient = new MashupAjaxClient(this, {
					success: options.success
				});
				mashupAjaxClient.addParameter(options.parameter, query);
				for (var i = 0; i < options.wuids.length; i++) {
					mashupAjaxClient.addWidget(options.wuids[i]);
				}
				mashupAjaxClient.update();
			}, 250);
		});
	};
})(jQuery);

/**
 * jQuery function for selecting a range of text in an input[type=text] box
 */
$(document).ready(function() {
	$.fn.selectTextRange = function(start, end) {
		return this.each(function() {
			if (this.setSelectionRange) {
				/* move to the end if the content is longer than the input field */
				try { /* does not work with chrome / safari */
					/* whitespace */
					var event = document.createEvent("KeyboardEvent");
					event.initKeyEvent("keypress", true, true, null, false, false, false, false, 32, 32);
					this.dispatchEvent(event);
					/* backspace */
					var event = document.createEvent("KeyboardEvent");
					event.initKeyEvent("keypress", true, true, null, false, false, false, false, 8, 0);
					this.dispatchEvent(event);
				}
				catch(e){}
				this.setSelectionRange(start, end);
			} else if(this.createTextRange) {//IE
				var range = this.createTextRange();
				range.collapse(true);
				range.moveEnd('character', end);
				range.moveStart('character', start);
				range.select();
			}
		});
	};
});

AS = (function($) {

	var maxZIndex = 1;

	/**
	 * Helper objects to render the advanced search box
	 */

	function Context(title, sections) {
		this.title = title;
		this.sections = sections;
	}
	Context.prototype.render = function(container) {
		function getColumnDiv(fromArray) {
			return $("<div />").addClass('column').append($.map(fromArray, function(elm) {
				return elm.toHtml()[0];
			}));
		}
		var $container = $(container);
		var slicePoint = Math.floor(this.sections.length / 2) + 1;
		var firstCol = getColumnDiv(this.sections.slice(0, slicePoint));
		var secondCol = getColumnDiv(this.sections.slice(slicePoint));

		$container.append($("<h3 />").html(this.title)).append(firstCol).append(secondCol);
	};

	function Section(title, items) {
		this.title = title;
		this.items = items;
	}
	Section.prototype.toHtml = function() {
		var div = $("<div />").addClass('section').append($("<h4 />").addClass('sectionTitle').html(this.title));
		var ul = $("<ul />");
		for(var i = 0; i < this.items.length; i++) {
			ul.append(this.items[i].toHtml());
		}
		div.append(ul);
		return div;
	};

	function Item(text, sample, expr, selectedText, doc) {
		this.text = text;
		this.sample = sample;
		this.expr = expr;
		this.selectedText = selectedText;
	}
	Item.prototype.toHtml = function() {
		var aLink = $("<a />").data("appendText", {expr: this.expr, selectedText: this.selectedText})
			.attr('href', '#')
			.html(this.text).click(evt.onClickItem);

		return $("<li />")
			.append(aLink)
			.append($("<span />").html(this.sample));
	};

	function SelectItem(defaultLabel, valueLabels, sampleLabel, searchExpression, values) {
		this.defaultLabel = defaultLabel;
		this.valueLabels = valueLabels;
		this.sampleLabel = sampleLabel;
		this.searchExpression = searchExpression;
		this.values = values;
	};
	SelectItem.prototype.toHtml = function() {
		var select = $("<select />").data('appendText', {expr: this.searchExpression});
		var defaultOption = $("<option />").html(this.defaultLabel);
		select.append(defaultOption).bind("change", evt.onChangeSelectItem);

		for (var i = 0; i < this.valueLabels.length; i++) {
			select.append($("<option />").html(this.valueLabels[i]).attr('value', this.values[i]));
		}

		var label = $("<span />").addClass('sample').html(this.sampleLabel);
		return $("<li />").addClass('select').append(select).append(label);
	};

	/**
	 *  Event handlers
	 */
	var evt = {
		onClickAdvancedSearchLink: function(e) {
			e.preventDefault();
			toggleAdvancedSearch($(this).parents('div.searchForm'));
		},

		onClickItem: function(e) {
			e.preventDefault();
			appendTextSearchInput(findSearchInput(this), $(this).data('appendText').expr, $(this).data('appendText').selectedText);
		},

		onChangeSelectItem: function(e) {
			e.preventDefault();
			appendTextSearchInput(findSearchInput(this), $(this).data('appendText').expr, this.value);
		}
	};

	function appendTextSearchInput($input, expression, selectedText) {
		var input = $input.get(0);
		/* fill the place holder and compute the range */
		var start = expression.indexOf("%@");
		var end = start;
		if (start > -1) {
			expression = expression.substring(0, start) + selectedText + expression.substring(start+2);
			end += selectedText.length;
		}

		var inputValue = input.value;
		var newValue = "" + inputValue;
		if (inputValue.length != 0 && inputValue[inputValue.length-1] != ' ') {
			newValue += " ";
		}
		var offset = newValue.length;
		newValue += expression;
		input.value = newValue;
		start += offset;
		end += offset;

		/* select text */
		$input.selectTextRange(start, end);
		$input.focus();
	};

	function findSearchInput(childDiv) {
		return $(childDiv).parents('.searchForm').find('input[type=text]');
	};

	function toggleAdvancedSearch($table) {
		if ($table.find('div.advancedSearchFormContent:hidden').length === 1) {
			showAdvancedSearch($table);
		} else {
			hideAdvancedSearch($table);
		}
	};

	function hideAdvancedSearch($table) {
		$table.find("div.advancedSearchFormContent").hide();
		$table.find('.searchFormContent').css('z-index', 'auto');
		$table.find('a.advancedSearchLink').css('z-index', 'auto');
	};

	function showAdvancedSearch($table) {
		var width = $table.find('tr:first').outerWidth() + ( -parseInt($table.find("div.advancedSearchFormContent").css('left'), 10) * 2);
		maxZIndex++;
		$table.find('.searchFormContent').css('z-index', maxZIndex);
		$table.find('a.advancedSearchLink').css('position', 'relative').css('z-index', maxZIndex +1);
		$table.find('div.column').width(width / 2);
		$table.find("div.advancedSearchFormContent").width(width).show();
	};

	function initSingle(containerNode, context) {
		$(containerNode).parents(".searchForm").find("a.advancedSearchLink").bind('click', evt.onClickAdvancedSearchLink);
		context.render(containerNode);
	};

	return {
		initSingle: initSingle,
		Context: Context,
		Item: Item,
		SelectItem: SelectItem,
		Section: Section,
		Context: Context
	};

})(jQuery);