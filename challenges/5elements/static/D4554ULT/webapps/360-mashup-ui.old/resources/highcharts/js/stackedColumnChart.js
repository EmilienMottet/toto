var hightChart_stackedColumn = {

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
	to2DStackedColumnSeries: function(json, xAxisLabels, opts) {
		var nbJson = json.length;
		var nbXAxisLabels = xAxisLabels.length;

		var tmpSeries = {};
		for (var j = 0; j < nbJson; j++) {
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
	},

	/*
	 * Transform categories to 1 dimension
	 *
	 * json:
	 * xAxisLabels:
	 * opts:
	 */
	to1DStackedColumnSeries: function(json, xAxisLabels, opts) {
		var nbJson = json.length;
		var nbXAxisLabels = xAxisLabels.length;

		for (var j = 0; j < nbJson; j++) {
			var serie = {
				name: highCharts.evalSerieName(json[j].serieName, json[j].json.facet),
				data: []
			};

			for (var i = 0; i < nbXAxisLabels; i++) {
				var category = hightChart_stackedColumn.getCategory(json[j].json.categories, xAxisLabels[i]);
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
	toRelativeFrequencyStackedColumnSeries: function(json, xAxisLabels, opts, nbResults, sortMode) {
		var nbJson = json.length;
		var nbXAxisLabels = xAxisLabels.length;

		if (json.length < 2) {
			return ;
		}

		var indexOfMainFeed = (nbResults[0] > nbResults[1] ? 0 : 1);
		var indexOfRefinedFeed = (nbResults[0] > nbResults[1] ? 1 : 0);

		var serie = {
			name: highCharts.evalSerieName(json[indexOfMainFeed].serieName, json[indexOfMainFeed].json.facet),
			data: []
		};

		for (var i = 0; i < nbXAxisLabels; i++) {
//			console.log('----------', xAxisLabels[i])
			if (nbResults[indexOfMainFeed] == 0 && nbResults[indexOfRefinedFeed] == 0) {
//				console.log('nbResults[' + indexOfMainFeed + '] == 0 && nbResults[' + indexOfRefinedFeed + '] == 0');
				serie.data.push({
					y: -1
				});
				continue;
			}

			var categoryMain = null;
			if (json[indexOfMainFeed] != null) {
				categoryMain = hightChart_stackedColumn.getCategory(json[indexOfMainFeed].json.categories, xAxisLabels[i]);
//				console.log('categoryMain:', categoryMain, 'CategoryName', xAxisLabels[i]);
			}

			var categoryRefined = null;
			if (json[indexOfRefinedFeed] != null) {
				categoryRefined = hightChart_stackedColumn.getCategory(json[indexOfRefinedFeed].json.categories, xAxisLabels[i]);
//				console.log('categoryRefined:', categoryRefined, 'CategoryName', xAxisLabels[i]);
			}

			if (categoryMain == null) {
//				console.log('No categoryMain found. Setting value to 0');
				serie.data.push({
					y: 0
				});
			} else if (categoryRefined == null) {
//				console.log('No categoryRefined found. Setting value of to 0');
				serie.data.push({
					y: 0
				});
			} else {
//				console.log('operation:', '('+categoryRefined.count+' / '+nbResults[indexOfRefinedFeed]+ ') / (' +categoryMain.count+' / '+nbResults[indexOfMainFeed]+')');
				var result = (categoryRefined.count / nbResults[indexOfRefinedFeed]) / (categoryMain.count / nbResults[indexOfMainFeed]);
//				console.log('result:', result)
//				var multiple = (result >= 1 ? result : (-1 / (1 - result)));
				var multiple = result;
//				console.log('multiple:', multiple)
				serie.data.push({
					y: multiple - 1,
					url: categoryRefined.url
				});
			}
		}

		// Remove categories that have y="n/a"
		for (var i = 0; i < nbXAxisLabels; i++) {
			if (serie.data[i].y == 'n/a') {
				serie.data.splice(i, 1);
				opts.xAxis.categories.splice(i, 1);
				i--;
				nbXAxisLabels--;
			}
		}

		/*
		 * Final sort
		 */
		if (this._sortRelativeFrequencyStackedColumnSeriesFunctions[sortMode] != null) {
			var tmpA = [];
			for (var i = 0; i < nbXAxisLabels; i++) {
				tmpA.push({
					xAxis: opts.xAxis.categories[i],
					value: serie.data[i]
				});
			}

			tmpA.sort(this._sortRelativeFrequencyStackedColumnSeriesFunctions[sortMode]);

			serie.data = [];
			opts.xAxis.categories = [];
			for (var i = 0; i < nbXAxisLabels; i++) {
				serie.data.push(tmpA[i].value);
				opts.xAxis.categories.push(tmpA[i].xAxis);
			}
		}

		opts.series.push(serie);
	},

	_sortRelativeFrequencyStackedColumnSeriesFunctions: {
		'y-asc': function(a, b) {
			if (a.value.y < b.value.y) {
				return -1;
			} else if (a.value.y > b.value.y) {
				return 1;
			} else {
				return 0;
			}
		},
		'y-desc': function(a, b) {
			if (a.value.y < b.value.y) {
				return 1;
			} else if (a.value.y > b.value.y) {
				return -1;
			} else {
				return 0;
			}
		}
	}
};