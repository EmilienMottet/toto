var hightChart_line = {

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
	to2DLineSeries: function(json, xAxisLabels, opts) {
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
	to1DLineSeries: function(json, xAxisLabels, opts) {
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
