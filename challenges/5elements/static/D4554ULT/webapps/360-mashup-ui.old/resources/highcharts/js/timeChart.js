var hightChart_time = {

	/*
	 * Transform categories to 1 dimension
	 *
	 * json: xAxisLabels: opts:
	 */
	to1DTimeSeries : function(json) {
		var nbJson = json.length;
		var series = [];

		for ( var j = 0; j < nbJson; j++) {
			var serie = {
				name : highCharts.evalSerieName(json[j].serieName, json[j].json.facet),
				data : []
			};

			var nbCategories = json[j].json.categories.length;
			for ( var i = 0; i < nbCategories; i++) {
				var category = json[j].json.categories[i];

				var tokens = category.path.replace(json[j].json.facet.name, '').split('/');
				while (tokens[0] == '') {
					tokens.splice(0, 1);
				}

				for ( var k = tokens.length; k < 3; k++) {
					tokens.push('01');
				}

				var date = new Date(tokens.join('/') + ' 1:0');
				if (isNaN(date)) {
				} else {
					serie.data.push([date.getTime(), category.countOrScore, category.url ]);
				}
			}

			if (serie.data.length == 0) {
				alert('TimeChart: Date format seems incorrect. Only categories with Top/cat/YEAR/MONTH/DAY format are supported');
				return;
			}

			series.push(serie);
		}
		return series;
	}
};
