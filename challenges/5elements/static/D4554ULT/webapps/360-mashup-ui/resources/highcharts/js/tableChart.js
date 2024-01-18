var highChart_table = {

	/*
	 *
	 */
	getCategory: function(categories, description) {
		var nbCategories = categories.length;
		for (var i = 0; i < nbCategories; i++) {
			if (categories[i].description == description) {
				return categories[i];
			}
		}
		return null;
	},

	/*
	 * Find xAxisLabels values
	 *
	 * json:
	 */
	get2DCategories: function(json) {
		var nbJson = json.length;

		/* Get all categories */
		var categories = [];
		for (var j = 0; j < nbJson && j < 1; j++) {
			var nbCategories = json[j].json.categories.length;
			for (var i = 0; i < nbCategories; i++) {
				categories.push(json[j].json.categories[i]);
			}
		}
		return categories;
	},

	/*
	 Transform categories to 2 dimensions
	*/
	to2DTableSeries: function(json, xAxisLabels, opts) {
		var nbJson = json.length;
		var nbXAxisLabels = xAxisLabels.length;

		var tmpSeries = {};
		for (var j = 0; j < nbJson && j < 1; j++) {
			/* Iterate over first level */
			for (var i = 0; i < nbXAxisLabels; i++) {
				var categoryFirstLevel = json[j].json.categories[i];

				/* Iterate over second level */
				for (var k = 0; k < categoryFirstLevel.categories.length; k++) {
					var categorySecondLevel = categoryFirstLevel.categories[k];
					if (tmpSeries[categorySecondLevel.description] == null) {
						tmpSeries[categorySecondLevel.description] = {
							url: categorySecondLevel.url,
							data: []
						};
						for (var l = 0; l < nbXAxisLabels; l++) {
							tmpSeries[categorySecondLevel.description].data.push({
								y: 0
							});
						}
					}
					tmpSeries[categorySecondLevel.description].data[i] = {
						url: categorySecondLevel.url,
						y: parseInt(categorySecondLevel.countOrScore)
					};
				}
			}

			/* Final push */
			for (var description in tmpSeries) {
				if (tmpSeries.hasOwnProperty(description)) {
					opts.series.push({
						name: description,
						data: tmpSeries[description].data,
						url: tmpSeries[description].url
					});
				}
			}
		}
	},

	/*
	 * Find xAxisLabels values
	 *
	 * json:
	 */
	get1DCategories: function(json) {
		var nbJson = json.length;

		/* Get all categories */
		var categories = [];
		for (var j = 0; j < nbJson; j++) {
			var nbCategories = json[j].json.categories.length;
			for (var i = 0; i < nbCategories; i++) {
				categories.push(json[j].json.categories[i]);
			}
		}
		return categories;
	},

	/*
	 * Transform categories to 1 dimension
	 *
	 * json:
	 * xAxisLabels:
	 * opts:
	 */
	to1DTableSeries: function(json, xAxisLabels, opts) {
		var nbJson = json.length;
		var nbXAxisLabels = xAxisLabels.length;

		for (var j = 0; j < nbJson; j++) {
			var serie = {
				name: highCharts.evalSerieName(json[j].serieName, json[j].json.facet),
				data: []
			};

			for (var i = 0; i < nbXAxisLabels; i++) {
				var category = hightChart_line.getCategory(json[j].json.categories, xAxisLabels[i]);
				if (category == null) {
					serie.data.push({
						y: 0
					});
				} else {
					serie.data.push({
						y: parseInt(category.countOrScore),
						url: category.url
					});
				}
			}

			opts.series.push(serie);
		}
	}
};

window.Highcharts.Table = function(options) {
	var headerHtml = '';
	var nbSeries = options.series.length;
	for (var i = 0; i < nbSeries; i++) {
		headerHtml += '<th>' + options.series[i].name + '</th>';
	}

	var contentHtml = '';
	var nbCategories = options.xAxis.categories.length;
	for (var i = 0; i < nbCategories; i++) {
		contentHtml += '<tr class="' + ((i % 2) ? 'odd' : 'even') + '">';
		contentHtml += '<td>' + options.xAxis.categories[i] + '</td>';
		for (var j = 0; j < nbSeries; j++) {
			if (options.series[j].data[i].r != null) {
			        var url = buildUrl(options.plotOptions.series.baseUrl, options.series[j].data[i].r);
				contentHtml += '<td><a href="' + url + '">' + options.series[j].data[i].y + '</a></td>';
			} else {
				contentHtml += '<td>' + options.series[j].data[i].y + '</td>';
			}
		}
		contentHtml += '</tr>';
	}

	var $container = typeof(options.chart.renderTo) == 'string' ? $('#' + options.chart.renderTo) : $(options.chart.renderTo);

	var style = 'overflow-y:auto;';
	style += 'height:' + (options.chart.height ? options.chart.height : $container.height()) + 'px;';
	if (options.chart.width) {
		style += 'width:' + options.chart.width + 'px;';
	}

	$container.html('' +
		'<div class="highcharts-container" style="' + style + '">' +
			'<table class="highcharts-table">' +
				'<thead>' +
					'<tr>' +
						'<th></th>' +
						headerHtml +
					'</tr>' +
				'</thead>' +
				'<tbody>' +
					contentHtml +
				'</tbody>' +
			'</table>' +
		'</div>');
};
