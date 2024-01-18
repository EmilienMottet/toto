var highCharts = {
	/**
	 *
	 * @param args
	 */
	create: function(args) {
		if (args.$widget == null) {
			throw '$widget cannot be null';
		}
		if (args.$chartContainer == null) {
			throw '$chartContainer cannot be null';
		}
		if (args.opts == null) {
			throw 'opts cannot be null';
		}

		highCharts.showRefined(args);

		if (args.opts.series.length == 0) {
			args.$chartContainer.html('<div class="no-data"><div class="fonticon fonticon-chart-line"></div>'+mashupI18N.get(args.opts.chartName, 'charts.nodata')+'</div>');
		} else {
			var opts = args.opts,
				categories = opts.xAxis.categories;
			if (parseInt(opts.nbMaxCategories) > 0 && categories && (categories.length == 0 || categories.length > parseInt(opts.nbMaxCategories))) {
				opts = $.extend(true, {}, args.opts);
				this._reduceCategories(parseInt(opts.nbMaxCategories), opts.displayOthers == undefined ? true : opts.displayOthers, opts.series, opts.xAxis.categories);
			}

			/* special case not handled by highcharts */
			if (opts.chart.defaultSeriesType == 'table') {
				return new Highcharts.Table(opts);
			} else if (opts.chartName == 'timeChart') {
				return new Highcharts.StockChart(opts);
			}
			return new Highcharts.Chart(opts);
		}
	},

	_reduceCategories: function(nbMaxCategories, displayOthers, series, categories) {
		/* reduce series sizes */
		var nbSeries = series.length;
		for (var i = 0; i < nbSeries; i++) {
			if (series[i].data.length > nbMaxCategories) {
				var others = series[i].data.splice(nbMaxCategories, 20000);
				if (displayOthers == true) {
					var nbOthers = others.length;
					var totalOthers = 0;
					for (var j = 0; j < nbOthers; j++) {
						totalOthers += others[j].y;
					}
					series[i].data.push({
						name: 'others',
						y: totalOthers,
						color: '#ccc'
					});
				}
			}
		}

		/* reduce categories size if relevant */
		if (categories.length > 0) {
			categories.splice(nbMaxCategories, 20000);
			if (displayOthers == true) {
				categories.push('others');
			}
		}
	},

	/**
	 *
	 */
	getXAxisLabels: function(categories) {
		var xAxisLabels = [];
		var nbCategories = categories.length;
		for (var i = 0; i < nbCategories; i++) {
			var category = categories[i];
			if (xAxisLabels.indexOf(category.description) == -1) {
				xAxisLabels.push(category.description);
			}
		}
		return xAxisLabels;
	},

	_sortModeFunctions: {
		'description-asc': function(a, b) {
			if (a.description.toLowerCase() < b.description.toLowerCase()) {
				return -1;
			} else if (a.description.toLowerCase() > b.description.toLowerCase()) {
				return 1;
			} else {
				return 0;
			}
		},
		'description-desc': function(a, b) {
			if (a.description.toLowerCase() < b.description.toLowerCase()) {
				return 1;
			} else if (a.description.toLowerCase() > b.description.toLowerCase()) {
				return -1;
			} else {
				return 0;
			}
		},
		'score-asc': function(a, b) {
			if (a.score < b.score) {
				return -1;
			} else if (a.score > b.score) {
				return 1;
			} else {
				return 0;
			}
		},
		'score-desc': function(a, b) {
			if (a.score < b.score) {
				return 1;
			} else if (a.score > b.score) {
				return -1;
			} else {
				return 0;
			}
		},
		'count-asc': function(a, b) {
			if (a.count < b.count) {
				return -1;
			} else if (a.count > b.count) {
				return 1;
			} else {
				return 0;
			}
		},
		'count-desc': function(a, b) {
			if (a.count < b.count) {
				return 1;
			} else if (a.count > b.count) {
				return -1;
			} else {
				return 0;
			}
		},
		'value-asc': function(a, b) {
			if (a.countOrScore < b.countOrScore) {
				return -1;
			} else if (a.countOrScore > b.countOrScore) {
				return 1;
			} else {
				return 0;
			}
		},
		'value-desc': function(a, b) {
			if (a.countOrScore < b.countOrScore) {
				return 1;
			} else if (a.countOrScore > b.countOrScore) {
				return -1;
			} else {
				return 0;
			}
		},
		'range-asc': function(a, b) {
			function toInt(str) {
				var i = str.split(/[^0-9]+/);
				if (i.length == 0) {
					return 0;
				}
				return parseInt(i[0]);
			}
			var ra = toInt(a.description.toLowerCase());
			var rb = toInt(b.description.toLowerCase());
			if (ra < rb) {
				return -1;
			} else if (ra > rb) {
				return 1;
			} else {
				return 0;
			}
		},
		'range-desc': function(a, b) {
			function toInt(str) {
				var i = str.split(/[^0-9]+/);
				if (i.length == 0) {
					return 0;
				}
				return parseInt(i[0]);
			}
			var ra = toInt(a.description.toLowerCase());
			var rb = toInt(b.description.toLowerCase());
			if (ra < rb) {
				return 1;
			} else if (ra > rb) {
				return -1;
			} else {
				return 0;
			}
		}
	},

	/**
	 * categories
	 * sortMode:
	 * 		description-asc
	 * 		description-desc
	 * 		score-asc
	 * 		score-desc
	 * 		count-asc
	 * 		count-desc
	 */
	getSortedXAxisLabels: function(categories, sortMode) {
		if (this._sortModeFunctions[sortMode] != null) {
			categories.sort(this._sortModeFunctions[sortMode]);
		}

		return highCharts.getXAxisLabels(categories);
	},

	getXAxisLabels: function(categories) {
		var xAxisLabels = [];
		var nbCategories = categories.length;
		for (var i = 0; i < nbCategories; i++) {
			var category = categories[i];
			if (xAxisLabels.indexOf(category.description) == -1) {
				xAxisLabels.push(category.description);
			}
		}
		return xAxisLabels;
	},

	/**
	 * $widget:
	 * opts:
	 * json:
	 * $insertRefinementsBefore: insert refinements before the specified element (optional)
	 * $insertRefinementsAfter: insert refinements after the specified element (optional)
	 */
	showRefined: function (options) {
		if (options.$widget == null) {
			throw '$widget option is missing';
		}
		if (options.opts == null) {
			throw 'opts option is missing';
		}
		if (options.opts.refinements == null) {
			return ;
		}

		options.$widget.find('.chartingRefinements').remove();
		var refinements = [];
		for (var i = 0; i < options.opts.refinements.length; i++) {
			var refine = options.opts.refinements[i];
			var refineUrl = options.opts.facetPageName != null ? (options.opts.facetPageName + "?" + refine.url) : refine.url;
			refinements.push("<a href='" + refineUrl + "' class='refined'>" + refine.description + "</a>");
		}
		if (refinements.length > 0) {
			var $div = $('<div class="chartingRefinements">Filter' + (refinements.length > 1 ? 's' : '') + ': ' + refinements.join(' ') + '</div>');
			if (options.$insertRefinementsAfter != null) {
				$div.insertAfter(options.$insertRefinementsAfter);
			} else if (options.$insertRefinementsBefore != null) {
				$div.insertBefore(options.$insertRefinementsBefore);
			} else {
				$div.prependTo(options.$widget);
			}
		}
	},

	evalSerieName: function(serieName, jsonFacet) {
		if (jsonFacet.name) {
			// is a facet
			serieName = serieName.replace('%{facetDescription}', jsonFacet.description);
			serieName = serieName.replace('%{facetPath}', jsonFacet.name);
		} else {
			// is a category
			serieName = serieName.replace('%{facetDescription}', jsonFacet.description);
			serieName = serieName.replace('%{facetPath}', jsonFacet.path);
			serieName = serieName.replace('%{facetCount}', jsonFacet.count);
			serieName = serieName.replace('%{facetScore}', jsonFacet.score);
			serieName = serieName.replace('%{facetValue}', jsonFacet.countOrScore);
		}
		return serieName;
	}
};

/*
 * example:
 * buildUrl('search', 'q=42') => search?q=42
 * buildUrl('search?nhits=21', 'q=42') => search?nhits&q=42
 * buildUrl('search?nhits=21', 'q=42', 's=exalead') => search?nhits&q=42&s=exalead
 */
/**
 * deprecated (new BuildUrl class should be used)
 */
function buildUrl() {
	var url = '';
	var nbArguments = arguments.length;
	if (nbArguments > 0) {
		for (var i = 0; i < nbArguments; i++) {
			url += arguments[i];
			if (i == 0) {
				// first argument
				if (arguments[i].match(/\?/) == null) {
					// does not contain question mark
					url += '?';
				} else {
					// contains a question mark
					if (arguments[i].match(/\?$/) == null) {
						// does not end with mark
						url += '&';
					}
				}
			} else {
				// concat parts
				url += '&';
			}
		}
	}
	return url;
};
