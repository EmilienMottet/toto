var hightChart_pie = {
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
	get1DCategories: function(json) {
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

	toPieSeries: function(json, xAxisLabels, opts) {
		var nbJson = json.length;
		var nbXAxisLabels = xAxisLabels.length;

		for (var j = 0; j < nbJson && j < 1; j++) {
			var serie = {
				name: highCharts.evalSerieName(json[j].serieName, json[j].json.facet),
				data: []
			};

			for (var i = 0; i < nbXAxisLabels; i++) {
				var category = hightChart_pie.getCategory(json[j].json.categories, xAxisLabels[i]);
				if (category == null) {
					serie.data.push({
						y: 0
					});
				} else {
					serie.data.push({
						name: highCharts.evalSerieName(json[j].serieName, category),
						y: category.countOrScore,
						url: category.url
					});
				}
			}

			opts.series.push(serie);
		}
	}
};
