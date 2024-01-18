exa.provide('exa.ui.GradientFormatter');

exa.require('exa.string.StringBuilder');
exa.require('exa.ui.colors.Gradient');

exa.ui.GradientFormatter = function (start, end) {
	this.start = start;
	this.end = end;
};

exa.ui.GradientFormatter.prototype.format = function(dataTable, columnIndex) {
	var gradient = new exa.ui.colors.Gradient(this.start, this.end),
		min = Number.MAX_VALUE,
		max = Number.MIN_VALUE,
		range,
		v,
		rowIndex,
		sb = new exa.string.StringBuilder(),
		style,
		bgColor;
	
	for (rowIndex = 0; rowIndex < dataTable.getNumberOfRows(); rowIndex++) {
		v = dataTable.getValue(rowIndex, columnIndex);
		if (v < min) {
			min = v;
		}
		if (v > max) {
			max = v;
		}		
	}
	range = max-min;
	for (rowIndex = 0; rowIndex < dataTable.getNumberOfRows(); rowIndex++) {
		style = dataTable.getProperty(rowIndex, columnIndex, 'style');
		sb.clear();
		if (style) {
			sb.append(style);
		}
		v = dataTable.getValue(rowIndex, columnIndex);
		v = (v - min) / range;
		if (isNaN(v)) {
			v = 0.5;
		}
		bgColor = gradient.getColor(v);
		sb.append('background-color:').append(bgColor).append(';');
		sb.append('color:').append(exa.ui.colors.colorFromBg(bgColor)).append(';');
		dataTable.setProperty(rowIndex, columnIndex, 'style', sb.toString());
	}
};
